export const errorHandler = (e: any) => {
  return (
    e?.errors?.[0]?.message ||
    e?.response?.data?.message ||
    e?.errors?.message ||
    e?.message ||
    "Something went wrong please try again later!"
  );
};
