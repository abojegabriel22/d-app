
import { FaEthereum, FaBitcoin, FaQuoteLeft } from 'react-icons/fa';
import { SiSolana } from 'react-icons/si';
import './Carousel.css';

function Carousel() {
  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">💬 What Our Users Say</h2>
      <div id="testimonialCarousel" className="carousel slide carousel-fade" data-bs-ride="carousel" data-bs-interval="4000">
        {/* <div className="carousel-indicators">
          <button type="button" data-bs-target="#testimonialCarousel" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
          <button type="button" data-bs-target="#testimonialCarousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
          <button type="button" data-bs-target="#testimonialCarousel" data-bs-slide-to="2" aria-label="Slide 3"></button>
          <button type="button" data-bs-target="#testimonialCarousel" data-bs-slide-to="3" aria-label="Slide 4"></button>
          <button type="button" data-bs-target="#testimonialCarousel" data-bs-slide-to="4" aria-label="Slide 5"></button>
          <button type="button" data-bs-target="#testimonialCarousel" data-bs-slide-to="5" aria-label="Slide 6"></button>
          <button type="button" data-bs-target="#testimonialCarousel" data-bs-slide-to="6" aria-label="Slide 7"></button>
          <button type="button" data-bs-target="#testimonialCarousel" data-bs-slide-to="7" aria-label="Slide 8"></button>
          <button type="button" data-bs-target="#testimonialCarousel" data-bs-slide-to="8" aria-label="Slide 9"></button>
          <button type="button" data-bs-target="#testimonialCarousel" data-bs-slide-to="9" aria-label="Slide 10"></button>
          <button type="button" data-bs-target="#testimonialCarousel" data-bs-slide-to="10" aria-label="Slide 11"></button>
          <button type="button" data-bs-target="#testimonialCarousel" data-bs-slide-to="11" aria-label="Slide 12"></button>
          <button type="button" data-bs-target="#testimonialCarousel" data-bs-slide-to="12" aria-label="Slide 13"></button>
          <button type="button" data-bs-target="#testimonialCarousel" data-bs-slide-to="13" aria-label="Slide 14"></button>
          <button type="button" data-bs-target="#testimonialCarousel" data-bs-slide-to="14" aria-label="Slide 15"></button>
          <button type="button" data-bs-target="#testimonialCarousel" data-bs-slide-to="15" aria-label="Slide 16"></button>
        </div> */}
        <div className="carousel-inner">
          <div className="carousel-item active">
            <div className="testimonial-card d-flex flex-column align-items-center text-center p-4">
              <div className="testimonial-icon mb-3">
                <FaEthereum size={32} className="text-primary" />
              </div>
              <blockquote className="blockquote">
                <p className="mb-3">"The ETH airdrop was incredibly smooth! I received my tokens within minutes of claiming. This platform is a game-changer for crypto enthusiasts."</p>
                <footer className="blockquote-footer">Alex Johnson <cite title="Source Title">ETH Recipient</cite></footer>
              </blockquote>
            </div>
          </div>
          <div className="carousel-item">
            <div className="testimonial-card d-flex flex-column align-items-center text-center p-4">
              <div className="testimonial-icon mb-3">
                <FaBitcoin size={32} className="text-warning" />
              </div>
              <blockquote className="blockquote">
                <p className="mb-3">"Claiming my BTC airdrop was effortless. The interface is user-friendly, and the rewards were substantial. Highly recommended!"</p>
                <footer className="blockquote-footer">Maria Garcia <cite title="Source Title">BTC Recipient</cite></footer>
              </blockquote>
            </div>
          </div>
          <div className="carousel-item">
            <div className="testimonial-card d-flex flex-column align-items-center text-center p-4">
              <div className="testimonial-icon mb-3">
                <FaEthereum size={32} className="text-primary" />
              </div>
              <blockquote className="blockquote">
                <p className="mb-3">"As a long-time ETH holder, I was thrilled with the airdrop. The process was secure and fast. Satoshi Meow delivers on its promises!"</p>
                <footer className="blockquote-footer">David Lee <cite title="Source Title">ETH Recipient</cite></footer>
              </blockquote>
            </div>
          </div>
          <div className="carousel-item">
            <div className="testimonial-card d-flex flex-column align-items-center text-center p-4">
              <div className="testimonial-icon mb-3">
                <FaBitcoin size={32} className="text-warning" />
              </div>
              <blockquote className="blockquote">
                <p className="mb-3">"The BTC rewards exceeded my expectations. Easy to claim, and the support team was responsive. Will definitely participate again."</p>
                <footer className="blockquote-footer">Sarah Chen <cite title="Source Title">BTC Recipient</cite></footer>
              </blockquote>
            </div>
          </div>
          <div className="carousel-item">
            <div className="testimonial-card d-flex flex-column align-items-center text-center p-4">
              <div className="testimonial-icon mb-3">
                <FaEthereum size={32} className="text-primary" />
              </div>
              <blockquote className="blockquote">
                <p className="mb-3">"ETH airdrop process was professional and transparent. I appreciated the real-time updates. Great job, Satoshi Meow team!"</p>
                <footer className="blockquote-footer">Michael Brown <cite title="Source Title">ETH Recipient</cite></footer>
              </blockquote>
            </div>
          </div>
          <div className="carousel-item">
            <div className="testimonial-card d-flex flex-column align-items-center text-center p-4">
              <div className="testimonial-icon mb-3">
                <FaBitcoin size={32} className="text-warning" />
              </div>
              <blockquote className="blockquote">
                <p className="mb-3">"BTC airdrop was a pleasant surprise! The platform is reliable, and the rewards are worth the effort. Five stars!"</p>
                <footer className="blockquote-footer">Emily Davis <cite title="Source Title">BTC Recipient</cite></footer>
              </blockquote>
            </div>
          </div>
          <div className="carousel-item">
            <div className="testimonial-card d-flex flex-column align-items-center text-center p-4">
              <div className="testimonial-icon mb-3">
                <SiSolana size={32} className="text-info" />
              </div>
              <blockquote className="blockquote">
                <p className="mb-3">"The Solana airdrop was lightning fast! Gas fees were incredibly low, and I got rewarded handsomely. Perfect for big holders like me."</p>
                <footer className="blockquote-footer">Jordan Smith <cite title="Source Title">Solana Recipient</cite></footer>
              </blockquote>
            </div>
          </div>
          <div className="carousel-item">
            <div className="testimonial-card d-flex flex-column align-items-center text-center p-4">
              <div className="testimonial-icon mb-3">
                <FaEthereum size={32} className="text-primary" />
              </div>
              <blockquote className="blockquote">
                <p className="mb-3">"ETH tokens airdrop exceeded expectations. The gas fee was so little compared to what I expected, and having a large wallet balance made it even better!"</p>
                <footer className="blockquote-footer">Lisa Wong <cite title="Source Title">ETH Tokens Recipient</cite></footer>
              </blockquote>
            </div>
          </div>
          <div className="carousel-item">
            <div className="testimonial-card d-flex flex-column align-items-center text-center p-4">
              <div className="testimonial-icon mb-3">
                <SiSolana size={32} className="text-info" />
              </div>
              <blockquote className="blockquote">
                <p className="mb-3">"Solana tokens came pouring in! The airdrop is best when you have a lot already in your wallet. Minimal fees, maximum rewards."</p>
                <footer className="blockquote-footer">Carlos Ramirez <cite title="Source Title">Solana Tokens Recipient</cite></footer>
              </blockquote>
            </div>
          </div>
          <div className="carousel-item">
            <div className="testimonial-card d-flex flex-column align-items-center text-center p-4">
              <div className="testimonial-icon mb-3">
                <FaBitcoin size={32} className="text-warning" />
              </div>
              <blockquote className="blockquote">
                <p className="mb-3">"BTC tokens airdrop was seamless. Low gas fees and substantial rewards for those with big balances. Satoshi Meow knows how to treat users!"</p>
                <footer className="blockquote-footer">Anna Petrov <cite title="Source Title">BTC Tokens Recipient</cite></footer>
              </blockquote>
            </div>
          </div>
          <div className="carousel-item">
            <div className="testimonial-card d-flex flex-column align-items-center text-center p-4">
              <div className="testimonial-icon mb-3">
                <FaEthereum size={32} className="text-primary" />
              </div>
              <blockquote className="blockquote">
                <p className="mb-3">"Another ETH airdrop success! The fees were negligible, and the rewards scaled with my wallet size. Highly professional platform."</p>
                <footer className="blockquote-footer">Tom Harris <cite title="Source Title">ETH Recipient</cite></footer>
              </blockquote>
            </div>
          </div>
          <div className="carousel-item">
            <div className="testimonial-card d-flex flex-column align-items-center text-center p-4">
              <div className="testimonial-icon mb-3">
                <SiSolana size={32} className="text-info" />
              </div>
              <blockquote className="blockquote">
                <p className="mb-3">"Solana rewards were amazing. Gas fees so low, and if you have a lot in your wallet, the airdrop multiplies the benefits!"</p>
                <footer className="blockquote-footer">Sophie Nguyen <cite title="Source Title">Solana Recipient</cite></footer>
              </blockquote>
            </div>
          </div>
          <div className="carousel-item">
            <div className="testimonial-card d-flex flex-column align-items-center text-center p-4">
              <div className="testimonial-icon mb-3">
                <FaBitcoin size={32} className="text-warning" />
              </div>
              <blockquote className="blockquote">
                <p className="mb-3">"BTC airdrop process was top-notch. Minimal fees and rewards that grow with your holdings. Couldn't be happier."</p>
                <footer className="blockquote-footer">Raj Patel <cite title="Source Title">BTC Recipient</cite></footer>
              </blockquote>
            </div>
          </div>
          <div className="carousel-item">
            <div className="testimonial-card d-flex flex-column align-items-center text-center p-4">
              <div className="testimonial-icon mb-3">
                <FaEthereum size={32} className="text-primary" />
              </div>
              <blockquote className="blockquote">
                <p className="mb-3">"ETH tokens flooded my wallet! The gas fee was surprisingly low, and having a substantial balance made the airdrop incredibly rewarding."</p>
                <footer className="blockquote-footer">Emma Taylor <cite title="Source Title">ETH Tokens Recipient</cite></footer>
              </blockquote>
            </div>
          </div>
          <div className="carousel-item">
            <div className="testimonial-card d-flex flex-column align-items-center text-center p-4">
              <div className="testimonial-icon mb-3">
                <SiSolana size={32} className="text-info" />
              </div>
              <blockquote className="blockquote">
                <p className="mb-3">"Solana tokens airdrop was a breeze. Low fees and the best rewards for users with large wallets. Satoshi Meow delivers!"</p>
                <footer className="blockquote-footer">Liam Johnson <cite title="Source Title">Solana Tokens Recipient</cite></footer>
              </blockquote>
            </div>
          </div>
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#testimonialCarousel" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#testimonialCarousel" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  );
}

export default Carousel;