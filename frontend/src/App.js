import logo from './logo.svg';
import './App.css';
import {useEffect, useState} from "react";
import axios from "axios";
import {motion} from "framer-motion";
import MusicPlayer from "./MusicPlayer";

const temperatureValues = [18, 20, 27, 28];
const humidityValues = [35, 40, 60, 65];
const lightValues = [100, 300, 500, 800];
const maxValues = {
    "temperature": 60,
    "humidity": 100,
    "light": 3000
};


const getValues = async (callback, lightsCallback) => {
    let responseVal;
    axios.get("http://localhost:3001/api/sensorData").then(response => {
        responseVal = response.data;
        console.log(responseVal.data);
        callback(responseVal.data);
        lightsCallback(responseVal.data);
    });

}


function App() {

    const [values, setValues] = useState({});
    const [counter, setCounter] = useState(0);
    const [lights, setLights] = useState([false, false, false]);
    const [optimal, setOptimal] = useState([false, false, false]);
    const [loading, setLoading] = useState(true);

    const lightsCallback = (data) => {
        const lightsCopy = [...lights];
        const optimalCopy = [...optimal];
        console.log(data.temperature);
        if (data.temperature > temperatureValues[3] || data.temperature < temperatureValues[0]) {
            lightsCopy[0] = true;
        } else if (data.temperature <= temperatureValues[2] && data.temperature >= temperatureValues[1]) {
            lightsCopy[0] = false;
            optimalCopy[0] = true;
        } else {
            lightsCopy[0] = false;
            optimalCopy[0] = false;
        }

        if (data.humidity > humidityValues[3] || data.humidity < humidityValues[0]) {
            lightsCopy[1] = true;
        } else if (data.humidity <= humidityValues[2] && data.humidity >= humidityValues[1]) {
            lightsCopy[1] = false;
            optimalCopy[1] = true;
        } else {
            lightsCopy[1] = false;
            optimalCopy[1] = false;
        }
        if (data.light > lightValues[3] || data.light < lightValues[0]) {
            lightsCopy[2] = true;
        } else if (data.light <= lightValues[2] && data.light >= lightValues[1]) {
            lightsCopy[2] = false;
            optimalCopy[2] = true;
        } else {
            lightsCopy[2] = false;
            optimalCopy[2] = false;
        }


        setLights(lightsCopy);
        setOptimal(optimalCopy);
    }

    useEffect(() => {
        getValues(setValues, lightsCallback);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            getValues(setValues, lightsCallback);
            setCounter(prev => prev + 1);
        }, 2000);
        return () => clearInterval(interval);
    }, [counter]);


    useEffect(() => {
        console.log(values);
    }, [values]);

    useEffect(() => {
        setLoading(false);
    }, []);

    return (
        <div className="app">
            <MusicPlayer></MusicPlayer>
            {loading ? null : <div style={{padding: "2rem", height: "90%", width: "90%"}}>
                <h1 className="header">EcoLorien Dashboard</h1>
                <div className="divider"></div>
                <div className="main-container">
                    <div className="content-container">
                        <div className="columns-container">
                            <div style={{width: "100%", height: "100%", display: "flex", paddingBottom: "1rem"}}>
                                {Object.keys(values).map((item) => <div className="columns">
                                    <motion.div animate={{
                                        height: (parseInt(values[item]) / maxValues[item]) * 100 + "%",
                                    }}
                                                initial={{height: 0}}
                                                key={item}
                                                className="value-column"
                                                style={{
                                                    minHeight: 0,
                                                }}
                                                transition={{duration: 1, ease: "easeInOut"}}

                                    >{values[item] + (item === "temperature" ? " °C" : item === "humidity" ? "%" : " LUX")}

                                    </motion.div>
                                </div>)}
                            </div>
                            <div className="columns-labels-container">
                                <div className="labels-lights-container">
                                    <h3>Temperature</h3>
                                    <div className={"lights"} style={{
                                        background: lights[0] ? "darkred" : optimal[0] ? "greenyellow" : "none",
                                    }}></div>
                                </div>
                                <div className="labels-lights-container">
                                    <h3>Humidity</h3>
                                    <div className={"lights"} style={{
                                        background: lights[1] ? "darkred" : optimal[1] ? "greenyellow" : "none",
                                    }}></div>
                                </div>
                                <div className="labels-lights-container">
                                    <h3>Light Level</h3>
                                    <div className={"lights"} style={{
                                        background: lights[2] ? "darkred" : optimal[2] ? "greenyellow" : "none",
                                    }}></div>

                                </div>

                            </div>
                        </div>
                        <div className="warning-signs">
                            <p>No lights mean you are on the appropriate levels. <span>But not optimal values.</span>
                            </p>
                            <p><span
                                style={{
                                    color: "green",
                                    fontWeight: "bold",
                                    fontSize: "1.8rem"
                                }}>Green lights</span> mean
                                you are on the optimal levels. <span>Try to stay in this range.</span></p>
                            <p><span
                                style={{color: "red", fontWeight: "bold", fontSize: "1.8rem"}}>Red lights</span> mean
                                you are out of acceptable levels. <span>Take actions immediately.</span></p>
                        </div>
                    </div>
                    <div className="info-container">
                        <p>Temperature: <span style={{fontWeight: "bold"}}>20°C - 27°C</span></p>
                        <p>Humidity: <span style={{fontWeight: "bold"}}>%40 - %60</span></p>
                        <p>Lights: <span style={{fontWeight: "bold"}}>300 - 500</span></p>
                    </div>
                </div>


            </div>}
        </div>
    );
}

export default App;
