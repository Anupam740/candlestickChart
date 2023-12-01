import React, { useState, useEffect } from "react";
import { LineChart, XAxis, Tooltip, CartesianGrid, Line } from "recharts";

const CandlestickChart = ({ data, label }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    setChartData((prevChartData) => {
      const newData = [
        ...prevChartData,
        {
          time: new Date().toLocaleTimeString(),
          value: data[label], 
        },
      ];

      
      if (newData.length > 10) {
        newData.shift();
      }

      return newData;
    });
  }, [data, label]);

  return (
    <LineChart
      width={600}
      height={400}
      data={chartData}
      margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
    >
      <XAxis dataKey="time" />
      <Tooltip />
      <CartesianGrid stroke="#f5f5f5" />
      <Line type="monotone" dataKey="value" stroke="#ff7300" />
    </LineChart>
  );
};

function App() {
  const [trading, setTrading] = useState({});

  useEffect(() => {
    const socketURL =
      "wss://functionup.fintarget.in/ws?id=fintarget-functionup";
    const socket = new WebSocket(socketURL);

    socket.addEventListener("open", (event) => {
      console.log("WebSocket connected:", event);
    });

    socket.addEventListener("message", (event) => {
      try {
        const newData = JSON.parse(event.data);
        console.log(event.data)
        setTrading(newData);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    });

    socket.addEventListener("close", (event) => {
      console.log("WebSocket close:", event);
    });

    return () => {
      socket.close();
    };
  }, []);

  return (
    <div>
      <div>{JSON.stringify(trading)}</div>
      {Object.keys(trading).map((key) => (
        <CandlestickChart key={key} data={trading} label={key} />
      ))}
    </div>
  );
}

export default App;