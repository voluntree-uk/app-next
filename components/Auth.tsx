import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleLogin = async (email: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signIn({ email });
      if (error) throw error;
      alert("Check your email for the login link!");
    } catch (error: any) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box sx={{ width: "40%", margin: "0 auto", mt: 20 }}>
        <Typography variant="h2" sx={{ mb: 1 }}>
          Shared.
        </Typography>
        <Typography sx={{ mb: 2 }}>
          Sign in via magic link with your email below
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              type="email"
              placeholder="Your email"
              value={email}
              fullWidth
              onChange={(e) => setEmail(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              onClick={(e) => {
                e.preventDefault();
                handleLogin(email);
              }}
              disabled={loading}
              fullWidth
              variant="contained"
            >
              <span>{loading ? "Loading" : "Send magic link"}</span>
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
