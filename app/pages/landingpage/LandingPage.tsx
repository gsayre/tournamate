import Navbar from "~/components/navbar"
import FeatureSection from "./FeatureSection";
import HeroSection from "./HeroSecttion";
import PricingSection from "./PricingSection ";
import WhySection from "./WhySection";

const LandingPage = () => {
    return (
			<div>
				<head>
					<Navbar />
				</head>
				<div className="container w-full">
					<HeroSection />
					<WhySection />
					<FeatureSection />
					<PricingSection />
				</div>
			</div>
		);
}
export default LandingPage