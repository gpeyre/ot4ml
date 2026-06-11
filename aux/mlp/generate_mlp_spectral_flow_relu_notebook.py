from pathlib import Path
from textwrap import dedent

import nbformat as nbf


ROOT = Path(__file__).resolve().parent
NOTEBOOK = ROOT / "mlp_spectral_flow_relu.ipynb"
FIG_DIR_TARGET = "../../neurips/figures/fig-mlp"


def md(text: str):
    return nbf.v4.new_markdown_cell(dedent(text).strip() + "\n")


def code(text: str):
    return nbf.v4.new_code_cell(dedent(text).strip() + "\n")


cells = [
    md(
        r"""
        # Spectral Flows for a 2-layer ReLU Mean-Field Model in 2D

        We consider particles $x=(u,v)$ with $u\in\mathbb{R}$ and $v\in\mathbb{R}^2$, and
        $$\phi((u,v),z)=u\,\max(\langle v,z\rangle,0), \qquad z\in\mathbb{R}^2.$$

        The predictor is
        $$h_{\mu}(z)=\int \phi((u,v),z)\,d\mu(u,v),$$
        and in particle form ($n$ atoms):
        $$h_{X}(z)=\frac1n\sum_{i=1}^n u_i\,\max(\langle v_i,z\rangle,0).$$

        We compare $p=1$ and $p=\infty$ spectral particle flows.
        """
    ),
    md(
        r"""
        ## Data and teacher

        Data points are sampled from $z\sim\mathcal{N}(0,I_2)$.

        Teacher has three neurons:
        - $u^\star\in\{+1,+1,-1\}$,
        - $v^\star$ equally spaced on the unit circle (angles $0,2\pi/3,4\pi/3$).
        """
    ),
    code(
        r"""
        from pathlib import Path
        import random

        import matplotlib as mpl
        import matplotlib.pyplot as plt
        import numpy as np
        import torch
        from matplotlib.collections import LineCollection

        torch.set_default_dtype(torch.float64)

        SEED = 7
        random.seed(SEED)
        np.random.seed(SEED)
        torch.manual_seed(SEED)

        FIG_DIR = Path("__FIG_DIR__")
        FIG_DIR.mkdir(parents=True, exist_ok=True)

        plt.rcParams.update(
            {
                "figure.dpi": 140,
                "font.size": 11,
                "axes.grid": True,
                "grid.alpha": 0.22,
                "axes.spines.top": True,
                "axes.spines.right": True,
            }
        )
        """.replace("__FIG_DIR__", FIG_DIR_TARGET)
    ),
    code(
        r"""
        def relu(t: torch.Tensor) -> torch.Tensor:
            return torch.clamp(t, min=0.0)


        def predict_from_particles(X: torch.Tensor, z: torch.Tensor) -> torch.Tensor:
            # X shape: (n,3) with columns (u, v1, v2), z shape: (N,2)
            u = X[:, 0:1]  # (n,1)
            v = X[:, 1:3]  # (n,2)
            logits = v @ z.T  # (n,N)
            return (u * relu(logits)).mean(dim=0)  # (N,)


        def empirical_risk(X: torch.Tensor, z: torch.Tensor, y: torch.Tensor) -> torch.Tensor:
            pred = predict_from_particles(X, z)
            # Energy: 0.5 * E[(pred-y)^2] under z~N(0,I2), approximated by MC average.
            return 0.5 * ((pred - y) ** 2).mean()


        N = 2000
        z_train = torch.randn(N, 2, dtype=torch.float64)
        z_eval = torch.randn(4000, 2, dtype=torch.float64)

        teacher_u = torch.tensor([1.0, 1.0, -1.0], dtype=torch.float64)
        # Shifted and slightly perturbed angles (not exactly equispaced, none at 0).
        teacher_angles = torch.tensor([0.38, 2.42, 4.63], dtype=torch.float64)
        teacher_v = torch.stack([torch.cos(teacher_angles), torch.sin(teacher_angles)], dim=1)
        teacher = torch.cat([teacher_u[:, None], teacher_v], dim=1)  # (3,3)

        y_train = predict_from_particles(teacher, z_train)
        y_eval = predict_from_particles(teacher, z_eval)

        print("Teacher neurons (u, v1, v2):")
        print(teacher)
        print("Teacher angles (rad):", teacher_angles.numpy())
        """
    ),
    md(
        r"""
        ## Spectral selectors and Euler flow
        """
    ),
    code(
        r"""
        def spectral_selector(G: torch.Tensor, p):
            if p == 1:
                return -G
            if p == float("inf"):
                if not torch.isfinite(G).all():
                    return torch.zeros_like(G)
                try:
                    U, S, Vh = torch.linalg.svd(G, full_matrices=False)
                except Exception:
                    G_reg = G + 1e-10 * torch.randn_like(G)
                    try:
                        U, S, Vh = torch.linalg.svd(G_reg, full_matrices=False)
                    except Exception:
                        return -G
                nuclear = S.sum()
                if float(nuclear) < 1e-14:
                    return torch.zeros_like(G)
                return -nuclear * (U @ Vh)
            raise ValueError("Only p=1 and p=inf are implemented.")


        def run_flow(
            X0: torch.Tensor,
            z: torch.Tensor,
            y: torch.Tensor,
            p,
            dt: float,
            steps: int,
            store_every: int = 25,
            max_delta_x: float = 0.20,
            time_rescale: float = 1.0,
        ):
            X = X0.clone().detach()
            losses = []
            history = [X.clone().cpu()]
            times = [0.0]
            loss_times = []
            for k in range(steps):
                X = X.detach().requires_grad_(True)
                loss = empirical_risk(X, z, y)
                loss.backward()
                G = X.grad.detach()
                V = spectral_selector(G, p)
                with torch.no_grad():
                    dX = dt * V
                    dX_norm = torch.linalg.norm(dX)
                    if float(dX_norm) > max_delta_x:
                        dX = dX * (max_delta_x / (float(dX_norm) + 1e-12))
                    X = X + dX

                    X = torch.nan_to_num(X, nan=0.0, posinf=30.0, neginf=-30.0)
                    X = torch.clamp(X, min=-30.0, max=30.0)

                losses.append(float(loss.detach().cpu()))
                loss_times.append((k + 1) * dt / time_rescale)
                if (k + 1) % store_every == 0 or (k + 1) == steps:
                    history.append(X.clone().cpu())
                    times.append((k + 1) * dt / time_rescale)
            return {
                "X_final": X.detach().cpu(),
                "losses": np.asarray(losses, dtype=float),
                "loss_times": np.asarray(loss_times, dtype=float),
                "history": torch.stack(history),
                "times": np.asarray(times, dtype=float),
            }
        """
    ),
    md(
        r"""
        ## Training setup

        We use different final times, with $T_1 = 1.5\,T_\infty$, and compare all
        displays in normalized time coordinates.
        Initialization keeps a relatively broad variance:
        $$\operatorname{Var}(X_0)=0.5 \times \operatorname{Var}(\text{teacher}) \text{ (per coordinate)}.$$
        """
    ),
    code(
        r"""
        n = 1920
        teacher_mean = teacher.mean(dim=0)
        teacher_std = teacher.std(dim=0, unbiased=False)
        init_std = np.sqrt(0.5) * teacher_std
        X_init = teacher_mean[None, :] + init_std[None, :] * torch.randn(n, 3, dtype=torch.float64)

        # Distinct horizons with T1 = 1.5 * Tinf.
        time_horizon_inf = 100000.0
        time_horizon_p1 = 1.5 * time_horizon_inf
        steps = 2000
        store_every = 30
        dt_map = {
            1: time_horizon_p1 / steps,
            float("inf"): time_horizon_inf / steps,
        }
        time_horizon_map = {1: time_horizon_p1, float("inf"): time_horizon_inf}
        max_delta_x = 0.20

        print(f"Final time T1={time_horizon_map[1]:.1f}, Tinf={time_horizon_map[float('inf')]:.1f}")
        print(f"Step size dt(p=1)={dt_map[1]:.4f}")
        print(f"Step size dt(p=inf)={dt_map[float('inf')]:.4f}")
        print(f"Horizon ratio T1/Tinf={time_horizon_map[1]/time_horizon_map[float('inf')]:.2f}")
        print(f"Max particle step norm per iteration: {max_delta_x:.2f}")

        out_p1 = run_flow(
            X_init,
            z_train,
            y_train,
            p=1,
            dt=dt_map[1],
            steps=steps,
            store_every=store_every,
            max_delta_x=max_delta_x,
            time_rescale=1.0,
        )
        out_pinf = run_flow(
            X_init,
            z_train,
            y_train,
            p=float("inf"),
            dt=dt_map[float("inf")],
            steps=steps,
            store_every=store_every,
            max_delta_x=max_delta_x,
            time_rescale=1.0,
        )

        loss_eval_p1 = empirical_risk(out_p1["X_final"], z_eval, y_eval)
        loss_eval_pinf = empirical_risk(out_pinf["X_final"], z_eval, y_eval)

        print(f"p=1   final train loss: {out_p1['losses'][-1]:.6e}, eval loss: {float(loss_eval_p1):.6e}")
        print(f"p=inf final train loss: {out_pinf['losses'][-1]:.6e}, eval loss: {float(loss_eval_pinf):.6e}")
        """
    ),
    md(
        r"""
        ## Energy evolution
        """
    ),
    code(
        r"""
        tau_snap = np.linspace(0.0, 1.0, 6)

        fig, ax = plt.subplots(figsize=(4.8, 6.2), constrained_layout=True)
        tau_p1 = out_p1["loss_times"] / time_horizon_map[1]
        tau_pinf = out_pinf["loss_times"] / time_horizon_map[float("inf")]
        ax.plot(tau_p1, out_p1["losses"], color="black", lw=2.2, linestyle="-", label=r"$p=1$")
        ax.plot(tau_pinf, out_pinf["losses"], color="black", lw=2.2, linestyle="--", label=r"$p=\infty$")
        for tau in tau_snap:
            tau = float(np.clip(tau, 0.0, 1.0))
            c = (tau, 0.0, 1.0 - tau)
            ax.axvline(float(tau), color=c, lw=1.2)
        ax.set_yscale("log")
        ax.set_xlim(0.0, 1.0)
        ax.set_xlabel(r"normalized time $t/T_p$")
        ax.set_ylabel("energy")
        ax.legend(loc="best")

        energy_pdf = FIG_DIR / "mlp_relu_energy_evolution.pdf"
        fig.savefig(energy_pdf, bbox_inches="tight")
        plt.show()

        print("Saved:")
        print(energy_pdf.resolve())
        """
    ),
    md(
        r"""
        ## Trajectories in reduced space $(p,q)=(|u|v_1,|u|v_2)$

        Teacher is represented by dashed radial half-lines from the origin.
        Display windows are centered at $0$ and identical for $p=1$ and $p=\infty$.
        """
    ),
    code(
        r"""
        def transform_to_pq(X: np.ndarray) -> np.ndarray:
            # X columns: (u, v1, v2)
            X = np.nan_to_num(X, nan=0.0, posinf=0.0, neginf=0.0)
            a = np.abs(X[:, 0:1])
            Y = a * X[:, 1:3]
            return np.clip(Y, -1e3, 1e3)


        def blue_red_color(tau: float):
            tau = float(np.clip(tau, 0.0, 1.0))
            return (tau, 0.0, 1.0 - tau)


        def path_segments_in_pq(path: np.ndarray, times: np.ndarray, T: float, max_points: int = 700):
            if len(path) > max_points:
                idx = np.unique(np.r_[np.linspace(0, len(path) - 1, max_points).round().astype(int), len(path) - 1])
                path = path[idx]
                times = times[idx]
            P = transform_to_pq(path)
            diffs = np.diff(P, axis=0)
            if diffs.shape[0] == 0:
                return np.zeros((0, 2, 2)), np.zeros((0,))
            seg_len = np.linalg.norm(diffs, axis=1)
            cumulative = np.concatenate([[0.0], np.cumsum(seg_len)])
            if cumulative[-1] < 1e-14:
                colors = np.linspace(0.0, 1.0, len(seg_len), endpoint=True)
            else:
                colors = 0.5 * (cumulative[:-1] + cumulative[1:]) / cumulative[-1]
            segs = np.stack([P[:-1], P[1:]], axis=1)
            return segs, colors


        def compute_common_centered_radius(histories, teacher_pts: torch.Tensor) -> float:
            teacher_xy = transform_to_pq(teacher_pts.numpy())
            cloud = [teacher_xy]
            for H in histories:
                cloud.append(transform_to_pq(H.numpy().reshape(-1, 3)))
            all_xy = np.concatenate(cloud, axis=0)
            finite = np.isfinite(all_xy).all(axis=1)
            all_xy = all_xy[finite]
            if all_xy.shape[0] == 0:
                return 1.0
            return max(float(np.max(np.abs(all_xy))), 1e-3)


        def plot_trajectory_panel(
            history: torch.Tensor,
            times: np.ndarray,
            T: float,
            teacher_pts: torch.Tensor,
            title: str,
            save_path: Path,
            centered_radius: float,
        ):
            H = history.numpy()
            teacher_xy = transform_to_pq(teacher_pts.numpy())

            fig, ax = plt.subplots(figsize=(5.2, 5.2), constrained_layout=True)

            # Show only 1/5th of trajectories for readability.
            shown_idx = np.arange(0, H.shape[1], 5, dtype=int)
            for i in shown_idx:
                segs, colors = path_segments_in_pq(H[:, i, :], times, T)
                if len(segs) == 0:
                    continue
                rgb = np.array([blue_red_color(t) for t in colors], dtype=float)
                lc = LineCollection(segs, colors=rgb, linewidths=1.1, alpha=0.5)
                ax.add_collection(lc)

            ray_radius = centered_radius
            first = True
            for p in teacher_xy:
                nrm = float(np.linalg.norm(p))
                if nrm < 1e-12:
                    continue
                q = ray_radius * p / nrm
                lbl = "teacher rays" if first else None
                ax.plot([0.0, q[0]], [0.0, q[1]], linestyle="--", color="black", lw=1.2, label=lbl)
                first = False

            window = 0.92 * centered_radius
            ax.set_xlim(-window, window)
            ax.set_ylim(-window, window)
            ax.set_axis_off()
            fig.savefig(save_path, bbox_inches="tight")
            plt.show()


        relu_2d_p1_pdf = FIG_DIR / "mlp_relu_uvbabs_trajectory_p1.pdf"
        relu_2d_pinf_pdf = FIG_DIR / "mlp_relu_uvbabs_trajectory_pinf.pdf"
        common_radius = compute_common_centered_radius([out_p1["history"], out_pinf["history"]], teacher)

        plot_trajectory_panel(
            out_p1["history"],
            out_p1["times"],
            time_horizon_map[1],
            teacher,
            r"ReLU trajectories in $(p,q)$ ($p=1$)",
            relu_2d_p1_pdf,
            common_radius,
        )
        plot_trajectory_panel(
            out_pinf["history"],
            out_pinf["times"],
            time_horizon_map[float("inf")],
            teacher,
            r"ReLU trajectories in $(p,q)$ ($p=\infty$)",
            relu_2d_pinf_pdf,
            common_radius,
        )

        print("Saved:")
        print(relu_2d_p1_pdf.resolve())
        print(relu_2d_pinf_pdf.resolve())
        """
    ),
    md(
        r"""
        ## Angular histogram snapshots (Parzen, weighted)

        We track the angular distribution of $v$ on $[0,2\pi]$ with particle weights
        $$w_i=|u_i|\,\|v_i\|_2.$$

        We use a smaller Parzen bandwidth and produce one single figure:
        a $2\times3$ grid of snapshots, where each panel overlays $p=1$ (solid) and
        $p=\infty$ (dashed), sampled at the same normalized times $\tau=t/T_p$.
        """
    ),
    code(
        r"""
        def circular_parzen_density_from_X(
            X: np.ndarray,
            theta_grid: np.ndarray,
            bandwidth: float = 0.10,
        ) -> np.ndarray:
            # X columns: (u, v1, v2)
            u = X[:, 0]
            v = X[:, 1:3]
            theta = np.mod(np.arctan2(v[:, 1], v[:, 0]), 2.0 * np.pi)
            w = np.abs(u) * np.linalg.norm(v, axis=1)
            if float(np.sum(w)) < 1e-14:
                return np.zeros_like(theta_grid)

            d = theta_grid[:, None] - theta[None, :]
            d = np.arctan2(np.sin(d), np.cos(d))  # wrap to (-pi,pi]
            K = np.exp(-0.5 * (d / bandwidth) ** 2) / (bandwidth * np.sqrt(2.0 * np.pi))
            dens = K @ w
            area = np.trapz(dens, theta_grid)
            if float(area) > 1e-14:
                dens = dens / area
            return dens


        def history_index_for_time(times_hist: np.ndarray, t: float) -> int:
            j = int(np.searchsorted(times_hist, t, side="left"))
            j = int(np.clip(j, 0, len(times_hist) - 1))
            return j


        def select_indices_by_normalized_time(out: dict, T: float, tau_grid: np.ndarray):
            times_hist = np.asarray(out["times"], dtype=float)
            times_loss = np.asarray(out["loss_times"], dtype=float)
            losses = np.asarray(out["losses"], dtype=float)
            hist_idx = []
            step_idx = []
            for tau in tau_grid:
                t = float(tau) * float(T)
                hist_idx.append(history_index_for_time(times_hist, t))
                step_idx.append(int(np.argmin(np.abs(times_loss - t))))
            hist_idx = np.asarray(hist_idx, dtype=int)
            step_idx = np.asarray(step_idx, dtype=int)
            return hist_idx, step_idx, losses[step_idx]


        def plot_histogram_snapshots_combined(out1: dict, outinf: dict, save_path: Path):
            theta_grid = np.linspace(0.0, 2.0 * np.pi, 256)
            tau_grid = tau_snap
            idx1, step_idx1, e1 = select_indices_by_normalized_time(out1, time_horizon_map[1], tau_grid)
            idxi, step_idxi, ei = select_indices_by_normalized_time(outinf, time_horizon_map[float("inf")], tau_grid)
            H1 = out1["history"].numpy()
            Hi = outinf["history"].numpy()
            teacher_theta = np.mod(np.arctan2(teacher[:, 2].numpy(), teacher[:, 1].numpy()), 2.0 * np.pi)

            fig, axes = plt.subplots(2, 3, figsize=(7.4, 6.8), constrained_layout=True, sharex=True, sharey=True)
            axes = axes.ravel()
            ymax = 0.0
            curves1 = []
            curvesi = []
            for k1, ki in zip(idx1, idxi):
                d1 = circular_parzen_density_from_X(H1[int(k1)], theta_grid)
                di = circular_parzen_density_from_X(Hi[int(ki)], theta_grid)
                curves1.append(d1)
                curvesi.append(di)
                ymax = max(ymax, float(np.max(d1)), float(np.max(di)))
            ymax = max(ymax, 1e-6)

            for j, (ax, k1, ki, ks1, ksi, e_tgt, d1, di) in enumerate(
                zip(axes, idx1, idxi, step_idx1, step_idxi, tau_grid, curves1, curvesi)
            ):
                color = blue_red_color(float(e_tgt))
                ax.plot(theta_grid, d1, color=color, lw=2.0, linestyle="-", label="p=1" if j == 0 else None)
                ax.plot(theta_grid, di, color=color, lw=2.0, linestyle="--", label=r"p=\infty" if j == 0 else None)
                for th in teacher_theta:
                    ax.axvline(float(th), color="black", linestyle="--", linewidth=0.9)
                ax.set_xlim(0.0, 2.0 * np.pi)
                ax.set_ylim(0.0, 1.08 * ymax)
                if j >= 3:
                    ax.set_xlabel("angle(v)")
                if j % 3 == 0:
                    ax.set_ylabel("density")
            axes[0].legend(loc="upper right")
            fig.savefig(save_path, bbox_inches="tight")
            plt.show()


        hist_combined_pdf = FIG_DIR / "mlp_relu_angular_hist_snapshots_combined.pdf"
        plot_histogram_snapshots_combined(out_p1, out_pinf, hist_combined_pdf)

        print("Saved:")
        print(hist_combined_pdf.resolve())
        """
    ),
]


nb = nbf.v4.new_notebook()
nb["metadata"] = {
    "kernelspec": {"display_name": "Python 3", "language": "python", "name": "python3"},
    "language_info": {"name": "python", "version": "3.11"},
}
nb["cells"] = cells

with NOTEBOOK.open("w", encoding="utf-8") as f:
    nbf.write(nb, f)

print(f"Wrote {NOTEBOOK}")
