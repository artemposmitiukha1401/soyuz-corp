import Image from "next/image"


type CooperationImage = {
  src: string;
  alt: string;
};

const mapImage: CooperationImage = {
  src: "/data_images/partners_customers.png",
  alt: "Логотипи замовників та партнерів",
};
const Cooperation = () => {
    return(
    <section className="page-container">
        <Image src={mapImage.src} alt={mapImage.alt} width={1610} height={977} className="w-full h-full"></Image>
    </section>
    );
}

export default Cooperation;
