export function encodebase62(num : number){
    const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result = "";
    
    while(num > 0) {
        result = chars[num % 62] + result;
        num = Math.floor(num / 62)
    }
    return result || "0 "
}

