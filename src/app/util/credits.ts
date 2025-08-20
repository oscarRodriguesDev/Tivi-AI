export const convertToCredits = (amountInBRL: number): number => {
    const rate = 1;
    return amountInBRL * rate;
  };
  
  export const convertToBRL = (credits: number): number => {
    const rate = 9.97;
    console.log(rate);
    return credits / rate;
  };
  