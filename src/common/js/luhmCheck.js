function luhmCheck(bankno) {
    if (bankno.length < 16 || (bankno.length > 16 && bankno.length < 19) || bankno.length > 19) {
        return false;
    } else {
        return true;
    }
}

export default luhmCheck;