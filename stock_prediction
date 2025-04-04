import yfinance as yf
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error
import requests
import io

# Fetch S&P 500 stock symbols
def get_sp500_symbols():
    url = "https://datahub.io/core/s-and-p-500-companies/r/constituents.csv"
    response = requests.get(url)
    if response.status_code == 200:
        df = pd.read_csv(io.StringIO(response.text))
        return df['Symbol'].tolist()
    else:
        print("Failed to fetch S&P 500 data.")
        return []

# Handle special tickers
def sanitize_symbol(symbol):
    return symbol.replace(".", "-")

# Fetch historical data for a stock
def fetch_stock_data(symbol, start_date, end_date):
    try:
        symbol = sanitize_symbol(symbol)  # Handle symbols like BRK.B
        stock = yf.Ticker(symbol)
        data = stock.history(start=start_date, end=end_date)
        if data.empty:
            print(f"No data found for {symbol}.")
            return None
        data = data[['Close']].reset_index()  # Use closing prices
        data['Date'] = pd.to_datetime(data['Date'])  # Ensure datetime
        data['Days'] = (data['Date'] - data['Date'].min()).dt.days  # Convert dates to days
        return data
    except Exception as e:
        print(f"Error fetching data for {symbol}: {e}")
        return None

# Train a linear regression model and predict the future price
def predict_future_price(data, days_into_future):
    try:
        # Prepare features and target
        X = np.array(data['Days']).reshape(-1, 1)  # Features (days)
        y = np.array(data['Close']).reshape(-1, 1)  # Target (prices)
        
        # Train linear regression model
        model = LinearRegression()
        model.fit(X, y)
        
        # Predict future price
        future_day = np.array([[data['Days'].max() + days_into_future]])
        predicted_price = model.predict(future_day)[0][0]
        
        # Calculate model accuracy (MSE)
        y_pred = model.predict(X)
        mse = mean_squared_error(y, y_pred)
        
        return predicted_price, mse
    except Exception as e:
        print(f"Error in prediction: {e}")
        return None, None

# Main function to find top stocks
def main():
    print("Fetching S&P 500 stock symbols...")
    sp500_symbols = get_sp500_symbols()
    if not sp500_symbols:
        return

    # Prompt user for hold period
    try:
        months = int(input("Enter the number of months you plan to hold the stock (0–24): "))
        if months < 0 or months > 24:
            raise ValueError("Please enter a valid number between 0 and 24.")
    except ValueError as e:
        print(e)
        return

    # Calculate the target future date
    days_into_future = months * 30  # Approximate days for the holding period
    start_date = "2019-01-01"  # Start date for historical data
    end_date = datetime.now().strftime('%Y-%m-%d')  # End date is today

    print(f"Predicting future prices for {months}-month holding period...")
    results = []

    for symbol in sp500_symbols:
        # Fetch historical data
        data = fetch_stock_data(symbol, start_date, end_date)
        if data is None or data.empty:
            print(f"Skipping {symbol} due to missing or incomplete data.")
            continue

        # Predict future price
        predicted_price, mse = predict_future_price(data, days_into_future)
        if predicted_price is None:
            continue

        # Calculate percentage differential
        current_price = data['Close'].iloc[-1]
        percent_diff = ((predicted_price - current_price) / current_price) * 100

        # Append results
        results.append({
            'Symbol': symbol,
            'Current Price': current_price,
            'Predicted Price': predicted_price,
            'Percent Differential (%)': percent_diff,
            'MSE': mse
        })

    # Convert results to DataFrame and sort by percentage differential
    results_df = pd.DataFrame(results)
    if not results_df.empty:
        results_df = results_df.sort_values(by='Percent Differential (%)', ascending=False)
        print(f"Top 15 S&P 500 Stocks for {months}-Month Holding Period:")
        print(results_df[['Symbol', 'Current Price', 'Predicted Price', 'Percent Differential (%)']].head(15).to_string(index=False))
    else:
        print("No valid data to display.")

if __name__ == "__main__":
    main()
