import { useNavigate } from "react-router-dom";
import '../styles/components/NotFound.css';

export const NotFound = () => {

    const navigate = useNavigate();
    
    return (
        <div>
            <section className="page_404">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12 col-sm-offset-1 text-center">
                            <div>
                                <div className="four_zero_four_bg">
                                    <h1 className="text-center ">404</h1>
                                </div>
                                <div className="contant_box_404">
                                    <h3 className="h2">
                                        Look like you're lost
                                    </h3>
                                    <p>the page you are looking for not available!</p>
                                    <button className="link_404" onClick={() => navigate('/home')}>Go to Home</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default NotFound;
