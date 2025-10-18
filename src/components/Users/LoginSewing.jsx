import { useState, useEffect } from "react";
import { login } from "../api/axios";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import "./LoginSewing.css"


function LoginSewing() {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isHovered, setIsHovered] = useState(false);
    const [showPassword, setShowPassword] = useState(false)
    const handleLogin = (e) => {
        e.preventDefault();

        login({ username, password }, { withCredentials: true })
            .then((res) => {
                enqueueSnackbar("✅ Login muvaffaqiyatli!", { variant: "success" });
                localStorage.setItem("full_name", res.data.full_name);
                localStorage.setItem("user_role", res.data.user_role);
                navigate("/");
            })
            .catch(() => {
                enqueueSnackbar("❌ Login xato: foydalanuvchi yoki parol noto‘g‘ri", {
                    variant: "error",
                });
            });
    };

    useEffect(() => {
        const loginEl = document.querySelector(".login");
        const container = document.querySelector(".login-container");

        const handleMouseMove = (e) => {
            const bounds = loginEl.getBoundingClientRect();
            const x = `${e.clientX - bounds.left}px`;
            const y = `${e.clientY - bounds.top}px`;
            loginEl.style.setProperty("--x", x);
            loginEl.style.setProperty("--y", y);
        };

        let currentRadius = 120;
        let targetRadius = 120;
        let animationId;

        const animateRadius = () => {
            currentRadius += (targetRadius - currentRadius) * 0.1;
            loginEl.style.setProperty("--radius", `${currentRadius}px`);
            animationId = requestAnimationFrame(animateRadius);
        };

        const onEnter = () => {
            targetRadius = 150;
            cancelAnimationFrame(animationId);
            animationId = requestAnimationFrame(animateRadius);
        };

        const onLeave = () => {
            targetRadius = 220;
            cancelAnimationFrame(animationId);
            animationId = requestAnimationFrame(animateRadius);
        };

        container?.addEventListener("mouseenter", onEnter);
        container?.addEventListener("mouseleave", onLeave);
        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener("mousemove", handleMouseMove);
            container?.removeEventListener("mouseenter", onEnter);
            container?.removeEventListener("mouseleave", onLeave);
        };
    }, []);
    return (
        <section className="login">


            <div className="login-container">
                <h2 className="login-title">
                    L<span className="flicker-o">o</span>g<span className="flicker">i</span>n
                </h2>
                <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "25px" }}>
                    <div className="input-group">
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder=" " // MUHIM! bo‘sh joy bo‘lishi kerak
                            required
                        />
                        <label>Логин</label>
                    </div>

                    <div className="input-group">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder=" "
                            required
                            style={{ letterSpacing: "1px" }}
                        />

                        <label>Пароль</label>
                        <span
                            className="password-toggle"
                            onClick={() => setShowPassword(prev => !prev)}
                        >
                            {showPassword ? <VisibilityOffIcon style={{fontSize:"18px"}} /> : <VisibilityIcon style={{fontSize:"18px"}}  />}
                        </span>
                    </div>

                    <button
                        type="submit"
                        className="login-sewing__btn"

                    >
                        Login
                    </button>
                </form>

            </div>
        </section>
    )
}

export default LoginSewing
