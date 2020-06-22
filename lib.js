
var xhr = new XMLHttpRequest();

// Transaction hash info
class Transaction {
    // Constructor
    constructor(hash) {
        this.hash = hash;
        this.api = "https://blockchain.info";
    }
    // Return true if transaction exists
    Exists() {
        var url = this.api + "/rawtx/" + this.hash + "?cors=true";
        xhr.open("GET", url, false);
        xhr.send();
        return xhr.status == 200 && !xhr.responseText.includes("Transaction not found");
    }
    // Get transaction
    GetTransaction() {
        var url = this.api + "/rawtx/" + this.hash + "?cors=true";
        xhr.open("GET", url, false);
        xhr.send();
        if (xhr.status == 200 && !xhr.responseText.includes("Transaction not found")) {
            return JSON.parse(xhr.responseText);
        }
    }
    // Get confirmations count
    Confirmations() {
        var block_height = this.GetTransaction();
        if (!("block_height" in block_height)) {
            return 0;
        } else {
            block_height = block_height["block_height"];
        }
        var block_count = Transaction.BlocksCount();
        return block_count - block_height + 1
    }
    // Get blocks count
    static BlocksCount() {
        var url = "https://blockchain.info/q/getblockcount";
        xhr.open("GET", url, false);
        xhr.send();
        if (xhr.status == 200) {
            return parseInt(xhr.responseText);
        }
    }
    // Convert BTC to USD
    static Convert(btc) {
        var url = "https://blockchain.info/tobtc?currency=USD&value=" + btc;
        xhr.open("GET", url, false);
        xhr.send();
        if (xhr.status == 200) {
            return parseFloat(xhr.responseText);
        }
    }

    
}