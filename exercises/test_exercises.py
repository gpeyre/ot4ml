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
        self.assertEqual(len(links.pdfs), 10)
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
