import React from "react";
import styles from "./UsefulLinks.module.css";
import flightRadarLogo from "../../assets/flight_radar_logo.png"

const links = [
    { title: "Web Meridian", url: "https://meridian.azal.az/", img: "https://meridian.azal.az/web.meridian/images/J2/logo_en.png" },
    { title: "Navblue", url: "https://ahy.nfp.vmc.navblue.cloud/", img: "https://ahy.nfp.vmc.navblue.cloud/favicon.ico" },
    { title: "Aviation Weather", url: "https://aviationweather.gov/data/metar/", img: "https://aviationweather.gov/assets/favicon-3c0969df.ico" },
    { title: "Amadeus", url: "https://www.accounts.amadeus.com/LoginService/authorizeAngular?service=ARD_J2&client_id=1ASIXARDJ2&LANGUAGE=GB&redirect_uri=https%3A%2F%2Ftc13.resdesktop.altea.amadeus.com%2Fapp_ard%2Fapf%2Finit%2Flogin%3FSITE%3DAJ2PAJ2P%26LANGUAGE%3DGB%26MARKETS%3DARDW_PROD_WBP%26ACTION%26event%3DLOGIN_LOGOUT%26ACTION%3DclpLogin#/login", img: "https://www.accounts.amadeus.com/LoginService/ng/favicon.ico" },
    { title: "Wind Component", url: "https://e6bx.com/wind-components/", img: "https://e6bx.com/assets/icons/icon32.png" },
    { title: "China Notam", url: "http://xbzglw.com/xbinfo/app/common/airrpt/index", img: "http://xbzglw.com/xbinfo/images/logo.ico" },
    { title: "FAA Notam", url: "https://www.notams.faa.gov/dinsQueryWeb/", img: "https://www.notams.faa.gov/dinsQueryWeb/images/1blustar.gif" },
    { title: "IQ", url: "https://ahy.asqs.net/core/main/iqmenue.php", img: "https://ahy.asqs.net/themes/default/assets/images/favicon.ico" },
    { title: "Flight Radar", url: "https://www.flightradar24.com/", img: flightRadarLogo },
    { title: "Web Manual", url: "https://azal.webmanuals.aero/admin/dashboard", img: "https://azal.webmanuals.aero/favicon.svg" }
];

const UsefulLinks = () => {
    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                {links.map((link, index) => (
                    <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.card}
                    >
                        <div className={styles.imagePlaceholder}>
                            <img src={link.img} alt={link.title} />
                        </div>
                        <span className={styles.title}>{link.title}</span>
                    </a>
                ))}
            </div>
        </div>
    );
};

export default UsefulLinks;
