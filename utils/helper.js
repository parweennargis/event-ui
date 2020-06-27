exports.splitDate = (data, isAd = true) => {
    return data.reduce((prev, curr, index) => {
        if (index == 3 && isAd) prev.push({ ad: true });
        const startDate = new Date(curr.start_date).toDateString().split(' ');
        curr.startDay = startDate[2];
        curr.startMonth = startDate[1];
        curr.startYear = startDate[3];
        prev.push(curr);
        return prev;
    }, []);
} 
