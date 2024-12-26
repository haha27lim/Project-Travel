import { useEffect, useRef, useState } from "react";
import UserService from "../services/user.service";
import EventBus from "../common/EventBus";

const BoardAdmin: React.FC = () => {
  const [content, setContent] = useState<string>("");
  const effectRan = useRef(false);

  useEffect(() => {
    if (effectRan.current === false) {
      UserService.getAdminBoard().then(
        (response) => {
          setContent(response.data);
        },
        (error) => {
          const _content =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          setContent(_content);
          if (error.response && error.response.status === 401) {
            EventBus.dispatch("logout");
          }
        }
      );
      return () => {
        effectRan.current = true;
      };
    }
  }, []);

  return (
    <div className="container">
      <header className="jumbotron">
        <h3>{content}</h3>
      </header>
    </div>
  );
};

export default BoardAdmin;
