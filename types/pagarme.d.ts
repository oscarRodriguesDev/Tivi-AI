// types/pagarme.d.ts
declare module 'pagarme' {
  export const client: {
    connect: (options: { api_key: string }) => Promise<{
      transactions: {
        create: (data: any) => Promise<any>;
      };
    }>;
  };
}
