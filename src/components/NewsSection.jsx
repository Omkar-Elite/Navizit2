import React, { useEffect, useState } from "react";
import Card from "./Card";
import Navbar from "../HomePage/Navbar/Navbar";
import AllFooter from "../HomePage/Footer/AllFooter";
import NavTourist from "../Tourist/NavTourist";

function NewsSection() {
  const [data, setData] = useState([]);
  const [visibleData, setVisibleData] = useState([]); // To hold sliced data for rendering
  const [firstIndex, setFirstIndex] = useState(0); // Start index for pagination
  const [lastIndex, setLastIndex] = useState(10); // End index for pagination
  const API_KEY = "65513dca9a8940a2841440cdf0ba845a"; // Replace with your actual Bing API key

  // Fetch data from News API
  const fetchData = async () => {
    try {
      const response = await fetch(
        `https://api.bing.microsoft.com/v7.0/news/search?q=Mumbai&count=20&mkt=en-IN&setLang=EN`,
        {
          headers: {
            "Ocp-Apim-Subscription-Key": API_KEY,
          },
        }
      );
      const mainData = await response.json();
      console.log(mainData);
      setData(mainData.value); // Store the fetched data
      setVisibleData(mainData.value.slice(0, 10)); // Show initial 10 items
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  // Load more data on button click
  const loadMoreData = () => {
    setVisibleData((prev) => [
      ...prev,
      ...data.slice(firstIndex + 10, lastIndex + 10),
    ]);
    setFirstIndex((prev) => prev + 10);
    setLastIndex((prev) => prev + 10);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
    <NavTourist/>

    <div >
     
      <div className="news-section grid gap-6 p-8">
        {visibleData.length > 0 ? (
          visibleData.map((item, index) => (
            <Card
              key={index}
              title={item.name}
              description={item.description}
              url={item.url}
              image={item.image?.thumbnail?.contentUrl}
              date={item.datePublished}
            />
          ))
        ) : (
          <p className="text-center text-xl">Loading news...</p>
        )}
      </div>
      {lastIndex < data.length && (
        <div className="text-center my-6">
          <button
            onClick={loadMoreData}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors duration-300"
          >
            Load More...
          </button>
        </div>
      )}
    </div>

    <AllFooter/>
    </>
  );
}

export default NewsSection;
