import React from "react";

export default function AboutUs() {
    const [isVisible, setIsVisible] = React.useState(false);

    React.useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <div className={`w-full h-full p-4 md:p-8 lg:p-12 bg-white flex flex-col items-center justify-center transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <h1 className="text-black text-4xl md:text-5xl lg:text-6xl font-bold font-lato mb-4 md:mb-6 lg:mb-8">
                About us
            </h1>
            <p className="w-full max-w-4xl text-center text-[#101010] text-lg md:text-xl lg:text-2xl font-medium font-lato leading-7 md:leading-8 lg:leading-10 mb-6 md:mb-8 lg:mb-12 transition-all duration-500 ease-in-out">
                We believe in fostering a collaborative and inclusive workplace where
                every employee is valued and has the opportunity to grow. At Ebiz, our
                mission is to create innovative solutions while nurturing talent and
                encouraging professional development.
            </p>
            <img
                className="w-full max-w-5xl h-auto rounded-[33px]"
                src="img/about.png"
                alt="Company Overview"
            />
        </div>
    );
}
