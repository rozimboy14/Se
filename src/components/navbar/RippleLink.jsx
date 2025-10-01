import "./Ripple.css";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { useRef } from "react";
const RippleLink = ({ to, children, className = "" }) => {
  const ref = useRef(null);

  const createRipple = (e) => {
    const ripple = document.createElement("span");
    const rect = ref.current.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.className = "ripple";
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    ref.current.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  };

  return (
    <Link to={to} className={`ripple-container ${className}`} ref={ref} onClick={createRipple}>
      {children}
    </Link>
  );
};
RippleLink.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node,
  className: PropTypes.string,
};
export default RippleLink;
