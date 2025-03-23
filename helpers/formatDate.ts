import dayjs from "dayjs";

const formatDate = (dateString: string, defaultFormat: string = "MMMM D, YYYY") => {
  return dayjs(dateString).format(defaultFormat);
};

export default formatDate;
