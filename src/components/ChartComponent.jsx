import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import "chartjs-adapter-date-fns";

const ChartComponent = ({ data, station }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    // Función interna para generar y actualizar el gráfico
    const generateChart = () => {
      // Verificar si la referencia al elemento canvas existe
      if (!chartRef.current) return;

      // Filtrar los datos según la estación seleccionada
      const filteredData = data.filter((item) => item.canal === station);

      // Definir combinaciones de dispositivo y estación a considerar para no mostrar datos vacíos. Ej: { dispositivo: 11, estacion: 9 }
      const combinations = [
        { dispositivo: 10, estacion: 9 },
        { dispositivo: 10, estacion: 10 },
        { dispositivo: 11, estacion: 9 },
        { dispositivo: 11, estacion: 10 },
      ];

      // Función para generar datasets dinámicamente según combinaciones y datos filtrados
      const generateDatasets = (combinations, filteredData) => {
        return combinations.reduce((acc, { dispositivo, estacion }) => {
          // Filtrar datos para la combinación actual
          const data = filteredData
            .filter(
              (item) =>
                item.dispositivo === dispositivo && item.estacion === estacion
            )
            .map((item) => ({ x: item.fecha_captura, y: item.nps_global }));

          // Agregar los datasets en base a las combinacines existentes
          if (data.length > 0) {
            acc.push({
              label: `Dispositivo ${dispositivo} - Estación ${estacion}`,
              data: data,
              borderColor: getRandomColor(),
              fill: false,
            });
          }
          return acc;
        }, []);
      };

      // Generar datasets basados en combinaciones y datos filtrados
      const datasets = generateDatasets(combinations, filteredData);

      // Configurar los datos y opciones del gráfico
      const chartData = {
        labels: filteredData.map((item) => item.fecha_captura),
        datasets: datasets,
      };

      const ctx = chartRef.current.getContext("2d");

      // Destruir la instancia anterior del gráfico si existe
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      // Crear una nueva instancia de Chart.js
      chartInstance.current = new Chart(ctx, {
        type: "line",
        data: chartData,
        options: {
          scales: {
            x: {
              title: {
                display: true,
                text: "Fecha de Captura",
              },
            },
            y: {
              title: {
                display: true,
                text: "NPS Global",
              },
            },
          },
        },
      });
    };

    // Llamar a la función para generar el gráfico
    generateChart();

    // Función de limpieza que se ejecuta al desmontar el componente
    return () => {
      // Destruir la instancia del gráfico si existe
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, station]);

  // Función para generar un color aleatorio en formato hexadecimal
  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  // Renderizado del componente
  return (
    <div className="containerChart">
      <h2>Estación {station}</h2>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default ChartComponent;
