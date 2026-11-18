"""Regression checks for the corrected sheets (requires NumPy and pypdf)."""
from fractions import Fraction
from html.parser import HTMLParser
from itertools import permutations
import unittest

import numpy as np
from pypdf import PdfReader

from build import ROOT, SHEETS, check_source


def sqrt_psd(a):
    values, vectors = np.linalg.eigh(a)
    return (vectors * np.sqrt(values)) @ vectors.T


class ExerciseChecks(unittest.TestCase):
    def test_webpage_links(self):
        class Links(HTMLParser):
            def __init__(self):
                super().__init__()
                self.pdfs = []

            def handle_starttag(self, tag, attrs):
                href = dict(attrs).get("href", "")
                if tag == "a" and href.startswith("exercises/") and href.endswith(".pdf"):
                    self.pdfs.append(href)

        links = Links()
        links.feed((ROOT.parent / "index.html").read_text())
        expected = {f"exercises/{stem}/{stem}{suffix}.pdf"
                    for stem in SHEETS for suffix in ("", "-uncorrected")}
        self.assertEqual(set(links.pdfs), expected)
        self.assertEqual(len(links.pdfs), 2 * len(SHEETS))
        for href in links.pdfs:
            self.assertTrue((ROOT.parent / href).is_file(), href)

    def test_sources_and_pdf_separation(self):
        for stem, count in SHEETS.items():
            check_source(ROOT / stem / (stem + ".tex"), count)
            for suffix in ("", "-uncorrected"):
                pdf = ROOT / stem / (stem + suffix + ".pdf")
                text = "\n".join(p.extract_text() or "" for p in PdfReader(pdf).pages)
                expected = 0 if suffix else count
                self.assertEqual(text.count("Useful hints"), expected, pdf)
                self.assertEqual(text.count("Detailed solution"), expected, pdf)
                self.assertNotIn("\ufffd", text, pdf)

    def test_assignment(self):
        c = np.array([[2, 1, 3], [3, 2, 2], [4, 3, 1]])
        costs = [sum(c[i, j] for i, j in enumerate(p)) for p in permutations(range(3))]
        self.assertEqual(sorted(costs), [5, 5, 7, 7, 9, 9])

    def test_exercise_attribution(self):
        credits = {
            "exo-flow-matching": "Julie Delon",
            "exo-sliced": "Kimia Nadjahi",
            "exo-distance-duality": "Julie Delon",
        }
        for stem, author in credits.items():
            for suffix in ("", "-uncorrected"):
                with self.subTest(sheet=stem, edition=suffix):
                    pdf = PdfReader(ROOT / stem / (stem + suffix + ".pdf"))
                    self.assertIn(author, pdf.pages[0].extract_text())
                    self.assertIn(author, pdf.metadata.author)

    def test_zero_one_cost_maximal_coupling(self):
        for a, b in (
            (np.array([.25, .25, .5]), np.array([.5, .125, .375])),
            (np.array([1., 0.]), np.array([0., 1.])),
            (np.array([.25, .75]), np.array([.25, .75])),
        ):
            m = np.minimum(a, b)
            r = (a-m).sum()
            plan = np.diag(m)
            if r > 0:
                plan += np.outer(a-m, b-m)/r
            np.testing.assert_allclose(plan.sum(axis=1), a)
            np.testing.assert_allclose(plan.sum(axis=0), b)
            np.testing.assert_array_equal(np.diag(plan), m)
            self.assertAlmostEqual(plan.sum()-np.trace(plan), np.abs(a-b).sum()/2)

    def test_c_transform_closure(self):
        # Rectangular costs test the two transform directions separately.
        cost = np.array([[2, 0, 3], [1, 4, 2]])
        f = np.array([3, 0])
        g = (cost-f[:, None]).min(axis=0)
        closed = (cost-g).min(axis=1)
        self.assertTrue(np.all(closed >= f))
        np.testing.assert_array_equal((cost-closed[:, None]).min(axis=0), g)

        cost = np.array([[0, 1], [1, 0]])
        f = np.array([0, 1])
        g = (cost-f[:, None]).min(axis=0)
        np.testing.assert_array_equal((cost-g).min(axis=1), f)
        self.assertAlmostEqual([.75, .25] @ f + [.25, .75] @ g, -.5)
        f_opt, g_opt = np.array([1., 0.]), np.array([-1., 0.])
        plan = np.array([[.25, .5], [0., .25]])
        np.testing.assert_array_equal(plan.sum(axis=1), [.75, .25])
        np.testing.assert_array_equal(plan.sum(axis=0), [.25, .75])
        slack = cost - f_opt[:, None] - g_opt
        self.assertTrue(np.all(slack >= 0))
        np.testing.assert_array_equal(plan * slack, np.zeros_like(plan))
        self.assertAlmostEqual((plan * cost).sum(), .5)

    def test_entropic_two_by_two_root(self):
        for p in (.12, .49, .5, .51, .89):
            for q in (.0001, .3, .9999):
                b = p*(1-q) + (1+q)/2
                x = p/(b + np.sqrt(b*b-2*p*(1-q)))
                self.assertTrue(max(0., p-.5) < x < min(.5, p))
                self.assertAlmostEqual((p-x)*(.5-x), q*x*(.5-p+x))
                if p == .5:
                    self.assertAlmostEqual(.5-x, .5*np.sqrt(q)/(1+np.sqrt(q)))

    def test_split_plan_interpolation(self):
        # The monotone plan splits sources and merges targets at the endpoints.
        edges = [(0, 1), (0, 2), (2, 2), (2, 5)]
        for t, expected in [(0, 2), (Fraction(1, 3), 4), (Fraction(3, 4), 4), (1, 3)]:
            self.assertEqual(len({(1-t)*x + t*y for x, y in edges}), expected)

    def test_sliced_projection_can_destroy_optimality(self):
        u, v = np.array([1., 1.]), np.array([-1., 2.])
        x, y = np.array([u, -u]), np.array([v, -v])
        costs = ((x[:, None, :] - y[None, :, :])**2).sum(axis=-1)
        np.testing.assert_array_equal(costs, [[5, 9], [9, 5]])
        self.assertLess(np.trace(costs), costs[0, 1] + costs[1, 0])
        projected_cost = np.mean((x[:, 0] - y[:, 0])**2)
        optimal_slice_cost = np.mean((np.sort(x[:, 0]) - np.sort(y[:, 0]))**2)
        self.assertEqual(projected_cost, 4.)
        self.assertEqual(optimal_slice_cost, 0.)

    def test_sliced_translation_decomposition(self):
        x = np.array([[-2., 3.], [1., 0.], [1., 2.]])
        y = np.array([[1., 0.], [5., -1.], [2., 1.]])
        angles = 2*np.pi*np.arange(48)/48
        directions = np.column_stack((np.cos(angles), np.sin(angles)))

        def slice_cost(a, b):
            sa, sb = np.sort(a @ directions.T, axis=0), np.sort(b @ directions.T, axis=0)
            return np.mean((sa-sb)**2, axis=0)

        a, b = x.mean(axis=0), y.mean(axis=0)
        raw = slice_cost(x, y)
        centered = slice_cost(x-a, y-b)
        np.testing.assert_allclose(raw, centered + (directions @ (a-b))**2)
        self.assertAlmostEqual(raw.mean(), centered.mean() + np.sum((a-b)**2)/2)

    def test_flow_matching_detailed_proofs_stay_in_solutions(self):
        stem = "exo-flow-matching"
        for suffix in ("", "-uncorrected"):
            pdf = PdfReader(ROOT / stem / (stem + suffix + ".pdf"))
            text = " ".join(" ".join(p.extract_text().split()) for p in pdf.pages)
            for phrase in ("Gaussian regression: proof of the recalled formula.",
                           "The integrating-factor argument never divides"):
                self.assertEqual(phrase in text, suffix == "")

    def test_gaussian_regression_residual(self):
        rng = np.random.default_rng(521)
        for rank in (3, 7):
            factor = rng.normal(size=(7, rank))
            covariance = factor @ factor.T
            cross, q = covariance[:4, 4:], covariance[4:, 4:]
            predictor = cross @ np.linalg.inv(q)
            residual = np.hstack((np.eye(4), -predictor))
            observed = np.hstack((np.zeros((3, 4)), np.eye(3)))
            np.testing.assert_allclose(residual @ covariance @ observed.T, 0., atol=1e-11)
            if rank == 3:
                # A singular joint law may have zero residual with an invertible observation covariance.
                np.testing.assert_allclose(residual @ covariance @ residual.T, 0., atol=1e-10)

    def test_flow_matching_affine_optimality(self):
        a = np.array([[1., 1.], [0., 1.]])
        b = np.diag([2., 1.])
        candidate = a @ b @ np.linalg.inv(a)
        source = a @ a.T
        target = a @ b @ b.T @ a.T
        np.testing.assert_allclose(candidate, [[2., -1.], [0., 1.]])
        np.testing.assert_allclose(candidate @ source @ candidate.T, target)
        root = sqrt_psd(source)
        optimal = np.linalg.solve(root, sqrt_psd(root @ target @ root)) @ np.linalg.inv(root)
        cost = lambda m: np.trace((np.eye(2)-m) @ source @ (np.eye(2)-m).T)
        self.assertGreater(cost(candidate), cost(optimal) + 1e-3)

    def test_gaussian_flow_matching_regression(self):
        rng = np.random.default_rng(513)
        factor = rng.normal(size=(6, 6))
        joint = factor @ factor.T + np.eye(6)
        s0, s1, r = joint[:3, :3], joint[3:, 3:], joint[3:, :3]
        for t in (0., .27, .63, 1.):
            projection = np.hstack(((1-t)*np.eye(3), t*np.eye(3)))
            difference = np.hstack((-np.eye(3), np.eye(3)))
            st = (1-t)**2*s0 + t*(1-t)*(r+r.T) + t*t*s1
            bt = ((1-t)*(r-s0) + t*(s1-r.T)) @ np.linalg.inv(st)
            np.testing.assert_allclose(st, projection @ joint @ projection.T, atol=1e-12)
            np.testing.assert_allclose(bt, difference @ joint @ projection.T @ np.linalg.inv(st), atol=1e-12)
            if t < 1:
                alternative = (((1-t)*r+t*s1) @ np.linalg.inv(st)-np.eye(3))/(1-t)
                np.testing.assert_allclose(bt, alternative, atol=1e-12)

    def test_flow_matching_time_change(self):
        s0 = np.array([[2., .4], [.4, 1.]])
        s1 = np.array([[1., -.3], [-.3, 3.]])
        r = np.array([[.1, .2], [-.1, .05]])
        velocity = lambda t, a, b, c: ((1-t)*(c-a)+t*(b-c.T)) @ np.linalg.inv(
            (1-t)**2*a+t*(1-t)*(c+c.T)+t*t*b)
        for t in (0., .3, .8, 1.):
            for c in (.4, 1., 2.7):
                s = 1-t+t*c
                direct = velocity(t, s0, c*c*s1, c*r)
                transformed = c/s**2*velocity(t*c/s, s0, s1, r)+(c-1)/s*np.eye(2)
                np.testing.assert_allclose(direct, transformed, atol=1e-12)

    def test_commuting_gaussian_flow(self):
        angle = .7
        o = np.array([[np.cos(angle), -np.sin(angle)], [np.sin(angle), np.cos(angle)]])
        s0, s1 = o @ np.diag([.4, 2.]) @ o.T, o @ np.diag([3., .7]) @ o.T
        flow = lambda t: sqrt_psd((1-t)**2*s0+t*t*s1) @ np.linalg.inv(sqrt_psd(s0))
        for t in (.2, .5, .8):
            st = (1-t)**2*s0+t*t*s1
            bt = (t*s1-(1-t)*s0) @ np.linalg.inv(st)
            h = 1e-6
            np.testing.assert_allclose((flow(t+h)-flow(t-h))/(2*h), bt @ flow(t), atol=1e-9)
            np.testing.assert_allclose(flow(t) @ s0 @ flow(t).T, st, atol=1e-12)
        np.testing.assert_allclose(flow(1), flow(1).T, atol=1e-12)

    def test_discrete_target_flow_continuity(self):
        targets = np.array([-2., .3, 1.7])

        def density_flux(t, x):
            components = np.exp(-.5*((x-t*targets)/(1-t))**2)/(np.sqrt(2*np.pi)*(1-t))
            return components.mean(), np.mean(components*(targets-x)/(1-t))

        # The posterior velocity satisfies the continuity equation, not just Bayes' identity.
        h = 1e-5
        for t in (.1, .4, .8):
            for x in (-1.3, .2, 1.5):
                dt = (density_flux(t+h, x)[0]-density_flux(t-h, x)[0])/(2*h)
                dx = (density_flux(t, x+h)[1]-density_flux(t, x-h)[1])/(2*h)
                self.assertAlmostEqual(dt+dx, 0., places=6)

    def test_piecewise_cost(self):
        self.assertEqual(Fraction(1, 144) + Fraction(1, 48) + Fraction(1, 144),
                         Fraction(5, 144))

    def test_parametric_couplings(self):
        for eps, eta in [(0.2, 0.3), (-0.5, 0.8), (-0.5, 0.2), (-1, 0.5)]:
            a = np.array([1 + eps, 1 + eta, 1 - eps - eta])
            if eps > 0:
                p = [[1, eps, 0], [0, 1-eps, eps+eta], [0, 0, 1-eps-eta]]
            elif eps + eta >= 0:
                p = [[1+eps, 0, 0], [-eps, 1, eta+eps], [0, 0, 1-eta-eps]]
            else:
                p = [[1+eps, 0, 0], [-eps, 1+eta+eps, 0], [0, -eps-eta, 1]]
            p = np.array(p)
            np.testing.assert_allclose(p.sum(1), a)
            np.testing.assert_allclose(p.sum(0), 1)
            self.assertGreaterEqual(p.min(), 0)

    def test_noncommuting_gaussian_covariance(self):
        a = np.array([[3., 1.], [1., 1.]])
        b = np.array([[1., -.2], [-.2, 2.]])
        sa, sb = sqrt_psd(a), sqrt_psd(b)
        middle = sqrt_psd(sa @ b @ sa)
        transport = np.linalg.solve(sa, middle) @ np.linalg.inv(sa)
        cross = sa @ middle @ np.linalg.inv(sa)
        np.testing.assert_allclose(transport @ a @ transport, b, atol=1e-12)
        np.testing.assert_allclose(cross, a @ transport, atol=1e-12)
        np.testing.assert_allclose(cross.T @ np.linalg.solve(a, cross), b, atol=1e-12)
        u, _, vt = np.linalg.svd(sb @ sa)
        np.testing.assert_allclose(cross, sa @ vt.T @ u.T @ sb, atol=1e-12)

    def test_nonsymmetric_kernel_gradient(self):
        rng = np.random.default_rng(517)
        x, a, b = rng.normal(size=(7, 3)), rng.normal(size=(3, 3)), rng.normal(size=(3, 3))
        direction = rng.normal(size=x.shape)
        s = x.T @ x / len(x)
        m = a.T @ s @ b + b.T @ s @ a + a @ s @ b.T + b @ s @ a.T
        energy = lambda z: np.mean((z @ a.T @ z.T) * (z @ b.T @ z.T))
        h = 1e-6
        finite_difference = (energy(x+h*direction)-energy(x-h*direction))/(2*h)
        gradient_pairing = np.sum((x @ m.T) * direction) / len(x)
        self.assertAlmostEqual(finite_difference, gradient_pairing, places=6)

    def test_fisher_variation(self):
        n = 1024
        x = 2*np.pi*np.arange(n)/n
        rho, eta = 1+.2*np.cos(x)+.1*np.sin(2*x), np.cos(3*x)+.3*np.sin(x)
        frequency = np.fft.fftfreq(n, 1/n)
        derivative = lambda a: np.fft.ifft(1j*frequency*np.fft.fft(a)).real
        fisher = lambda a: np.mean(derivative(a)**2/a)
        q = -2*derivative(derivative(np.log(rho)))-derivative(np.log(rho))**2
        h = 1e-5
        self.assertAlmostEqual((fisher(rho+h*eta)-fisher(rho-h*eta))/(2*h),
                               np.mean(q*eta), places=8)

    def test_unbalanced_coordinate_optimum(self):
        a, total, eps, tau = .3, .8, .2, .7
        f = eps*tau/(eps+tau)*np.log(a/total)
        self.assertAlmostEqual(a*np.exp(-f/tau), total*np.exp(f/eps), places=14)

    def test_gaussian_sinkhorn(self):
        sa, sb, eps = .7, 1.3, .4
        q = (np.sqrt(eps**2+4*sa**2*sb**2)-eps)/2
        covariance = np.array([[sa**2, q], [q, sb**2]])
        self.assertAlmostEqual(np.linalg.inv(covariance)[0, 1], -1/eps, places=12)
        mean, a, b, c, x = .2, .3, -.1, .15, .4
        aa = (1-a)/eps+1/sb**2
        bb = (x+b)/eps+mean/sb**2
        dd = (c-x*x/2)/eps-mean*mean/(2*sb**2)
        exact = np.exp(dd+bb*bb/(2*aa))/(sb*np.sqrt(aa))
        nodes, weights = np.polynomial.hermite.hermgauss(120)
        y = mean+np.sqrt(2)*sb*nodes
        integral = np.dot(weights, np.exp((a*y*y/2+b*y+c-(x-y)**2/2)/eps))/np.sqrt(np.pi)
        self.assertAlmostEqual(exact, integral, places=10)

    def test_squared_distance_time_change(self):
        x0, target, time = np.array([-2., 1., 4.]), np.array([-1., 2., 6.]), .7
        decay = np.exp(-2*time)
        current = decay*x0+(1-decay)*target
        velocity = 2*decay*(target-x0)
        np.testing.assert_allclose(velocity, 2*(target-current))
        self.assertAlmostEqual(np.mean((current-target)**2),
                               decay**2*np.mean((x0-target)**2))


if __name__ == "__main__":
    unittest.main()
