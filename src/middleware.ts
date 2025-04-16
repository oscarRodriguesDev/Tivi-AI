import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login", // Página de login
  },
});

export const config = {
  matcher: ["/app/:path*", ], // Rotas protegidas
};

