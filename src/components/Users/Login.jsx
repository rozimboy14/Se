import { useState, useEffect } from "react";
import "./Login.css";
import { login } from "../api/axios";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";


function Login() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isHovered, setIsHovered] = useState(false);

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
      targetRadius = 300;
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
    <section className="login relative flex justify-center items-center min-h-screen bg-gray-100">
      {/* SVG clipPath */}
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <clipPath id="shirt-clip" clipPathUnits="objectBoundingBox">
            <path
              d="M 0.8164 0.1464 L 0.6486 0.103 L 0.6411 0.1238 L 0.6264 0.1515 L 0.6066 0.1754 L 0.5848 0.1921 L 0.5641 0.202 L 0.5363 0.2065 L 0.5063 0.2046 L 0.4782 0.1988 L 0.4534 0.1831 L 0.4376 0.1652 L 0.4275 0.1515 L 0.42 0.1238 L 0.4135 0.103 L 0.2465 0.1464 L 0.1648 0.2241 L 0.113 0.2819 L 0.2139 0.3699 L 0.2538 0.3255 L 0.2661 0.5083 L 0.2686 0.6289 L 0.2661 0.7462 L 0.2583 0.9199 L 0.7999 0.918 L 0.7933 0.7462 L 0.79 0.6289 L 0.79 0.5083 L 0.8049 0.3255 L 0.8393 0.3699 L 0.942 0.2819 L 0.8924 0.2241 Z"
                stroke="#FF0000"
    strokeWidth="0.01"
    fill="#000000"
            />
          </clipPath>
        </defs>
      </svg>

      <div className="container">
        <div
          className="login-container  shadow-lg relative transition-all duration-300"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            clipPath: "url(#shirt-clip)",
            WebkitClipPath: "url(#shirt-clip)",
            width: "540px",
            padding: "40px 30px",
            height:"500px",
            color: "black",

     
            color: isHovered ? "black":"white",
          }}
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
          <form onSubmit={handleLogin} className="flex flex-col gap-4" style={{marginTop:"100px",display:"flex",flexDirection:"column",alignItems:"center"}}>
            <div className="flex flex-col " style={{display:"flex",flexDirection:"column",alignItems:"center",marginLeft:"30px"}}>
              <label>Логин</label>
              <input
                className="border px-3 py-2 rounded text-black"
                type="text"
                placeholder="Логин"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={{width:"250px",height:"35px",marginBottom:"25px",}}
              />
            </div>
            <div className="flex flex-col" style={{display:"flex",flexDirection:"column",alignItems:"center",marginLeft:"30px"}}>
              <label>Парол</label>
              <input
                className="border px-3 py-2 rounded text-black"
                type="password"
                placeholder="Парол"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                 style={{width:"250px",height:"35px",marginBottom:"25px"}}
                required
              />
            </div>
            <button
              type="submit"
              className="mt-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Kirish
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Login;
