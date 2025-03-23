import dayjs from "dayjs";

const isRSVPDeadlinePassed = (deadline: string) => {
  return dayjs(deadline).startOf("day").isBefore(dayjs().startOf("day"));
};
export default isRSVPDeadlinePassed;
