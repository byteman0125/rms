'use client'
// Next Imports
import Link from 'next/link'
import { useRef, useState, useEffect } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import { supabase } from '@/utils/supabase'

// Component Imports

const Recharts = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user.user_metadata?.userName || null)
    }
    getUser()
  }, []);

  return (
    <Grid container spacing={6}>
      {`Here is ${user} page`}
    </Grid>
  )
}

export default Recharts
