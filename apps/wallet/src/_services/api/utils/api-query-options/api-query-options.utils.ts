export const apiQueryOptions = <T extends object = object>(
  options: T,
): typeof options => {
  return Object.assign({}, options, {
    refetchOnWindowFocus: false,
    retry: false,
  });
};
