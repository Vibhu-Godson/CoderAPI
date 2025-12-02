using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace CoderAPI.DTOs.plan
{
    public class RazorpayPaymentResponse
    {
        [JsonProperty("id")]
        public string Id { get; set; }                 // pay_xxxxx

        [JsonProperty("entity")]
        public string Entity { get; set; }             // "payment"

        [JsonProperty("amount")]
        public int Amount { get; set; }                // Amount in paise (100 INR = 10000)

        [JsonProperty("currency")]
        public string Currency { get; set; }           // INR, USD, etc.

        [JsonProperty("status")]
        public string Status { get; set; }             // created, authorized, captured, failed, refunded

        [JsonProperty("method")]
        public string Method { get; set; }             // card, upi, netbanking, wallet

        [JsonProperty("captured")]
        public bool Captured { get; set; }

        [JsonProperty("created_at")]
        public long CreatedAt { get; set; }            // Unix timestamp

        // Nested objects (optional depending on payment method)
        [JsonProperty("card")]
        public CardInfo Card { get; set; }

        [JsonProperty("upi")]
        public UpiInfo Upi { get; set; }

        [JsonProperty("bank")]
        public string Bank { get; set; }               // For netbanking, it's just a string (bank code)

        [JsonProperty("wallet")]
        public string Wallet { get; set; }             // For wallets, Razorpay returns string (like "jio_money")

        // Catch-all for future fields so deserialization won’t break
        [JsonExtensionData]
        public Dictionary<string, object> ExtraFields { get; set; }
    }

    public class CardInfo
    {
        [JsonProperty("id")]
        public string Id { get; set; }                 // card_xxxxx

        [JsonProperty("network")]
        public string Network { get; set; }            // Visa, Mastercard, Rupay

        [JsonProperty("type")]
        public string Type { get; set; }               // credit or debit

        [JsonProperty("issuer")]
        public string Issuer { get; set; }             // HDFC, ICICI etc.

        [JsonProperty("last4")]
        public string Last4 { get; set; }

        [JsonProperty("international")]
        public bool International { get; set; }

        [JsonProperty("emi")]
        public bool Emi { get; set; }
    }

    public class UpiInfo
    {
        [JsonProperty("vpa")]
        public string Vpa { get; set; }                // user@upi

        [JsonProperty("flow")]
        public string Flow { get; set; }               // intent / collect
    }

    public class PaymentStatusResponseModel
    {
        public int Amount { get; set; }                // Amount in paise
        public string Currency { get; set; }           // INR, USD, etc.
        public string Status { get; set; }             // created, authorized, captured, failed, refunded
        public string Method { get; set; }             // card, upi, netbanking, wallet
        public DateTime TransactionTime { get; set; }
        public string PaymentId { get; set; }
        public string OrderId { get; set; }
        public long UserPlanId { get; set; }
    }
}
