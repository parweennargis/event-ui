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
};

exports.splitTime = (data) => {
    return data.reduce((prev, curr) => {
        if (curr.start_time) {
            const time = curr.start_time.split(':');
            const hours = time[0];
            if (hours > 12) {
                curr.start_time = `${hours - 12}:${time[1]}`;
                curr.start_time_type = 'PM';
            } else {
                curr.start_time_type = 'AM';
            }
        }
        if (curr.end_time) {
            const endTime = curr.end_time.split(':');
            const endTimeHr = endTime[0];
            if (endTimeHr > 12) {
                curr.end_time = `${endTimeHr - 12}:${endTime[1]}`;
                curr.end_time_type = 'PM';
            } else {
                curr.end_time_type = 'AM';
            }
        }
        prev.push(curr);
        return prev;
    }, []);
}
