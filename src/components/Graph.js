import React from 'react'
import SentimentAnalyzer from './SentimentAnalyzer';


import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

function dataGenerator(company) {
  let companyData = []

  console.log(company)

  //key for each price
  for (let i = 1556582400000; i <= 1668124800000; i += 86400000) {
    let date = new Date(i)

    let dailyCompanyData = {
      date:
        date.toLocaleString('en-US', { month: 'short' }) +
        ' \'' +
        date.toLocaleDateString('en', {year: '2-digit'}),
      unix: i,
      Close: company.Close[i],
      SMA: company.SMA_100[i],
      EMA: company.EMA_100[i],
      UpperBand: company.Upperband[i],
      LowerBand: company.Lowerband[i],
    }
    companyData.push(dailyCompanyData)
  }

  return companyData
}

export default function Graph(props) {
  let dates = dataGenerator(props.companyFile)

  console.log(props.companyFile)

  return (
    <>
      <ResponsiveContainer width="100%" height={600}>
        <LineChart
          data={dates}
          margin={{
            top: 5,
            right: 10,
            left: 10,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis minTickGap={16} stroke="#E1E1E1" dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
  
          <Line
            connectNulls
            type="line"
            dataKey="Close"
            stroke="#ff0000"
            dot={false}
          />
          <Line
            connectNulls
            type="monotone"
            dataKey="SMA"
            stroke="#0000ff"
            dot={false}
          />
          <Line
            connectNulls
            type="monotone"
            dataKey="EMA"
            stroke="#00ff00"
            dot={false}
          />
          <Line
            connectNulls
            type="line"
            dataKey="UpperBand"
            stroke="#E0E0E0"
            dot={false}
          />
          <Line
            connectNulls
            type="line"
            dataKey="LowerBand"
            stroke="#E0E0E0"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
  
      {/* New Sentiment Analyzer Section */}
      <SentimentAnalyzer stockName={props.companyName} />
    </>
  );  
}
