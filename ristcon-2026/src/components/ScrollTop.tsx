import { Link, useNavigate } from "react-router-dom";

interface ScrollToTopLinkProps {
  to: string;
  children: React.ReactNode;
}

const ScrollTop: React.FC<ScrollToTopLinkProps> = ({ to, children }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(to);      // navigate to the route
    window.scrollTo({ top: 0, behavior: "smooth" }); // scroll to top
  };

  return (
    <button
      onClick={handleClick}
      className="text-gray-300 hover:text-blue-400 transition-colors duration-300"
    >
      {children}
    </button>
  );
};

export default ScrollTop;
