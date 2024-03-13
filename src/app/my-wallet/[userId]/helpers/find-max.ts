import { IFilteredFinanceData } from "@/interfaces/IFilteredFinanceData";

// searches for the largest number according to the property passed from the array
export const findMaxByProperty = (
  arr: IFilteredFinanceData[],
  property: keyof IFilteredFinanceData,
) => {
  return arr.reduce((acc, curr) => {
    return curr[property] > acc[property] ? curr : acc;
  }, arr[0]);
};

//calculates the total according to the array passed in the argument
export const calculateTotal = (array: number[]) => {
  return array.length > 0 ? array?.reduce((acc, curr) => acc + curr) : 0;
};
