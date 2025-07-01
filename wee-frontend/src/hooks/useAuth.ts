import { useMutation } from "@tanstack/react-query"
import { getCookie } from "../utils"
import type { signInType, signUpType } from "../types/auth.type"
import { postWithToken } from "../api"


export const useAuth = () => {
    const accessToken = getCookie('accessToken')
    const signInMutation = useMutation({
        mutationFn: async (data: signInType) => {
            const response = await postWithToken(accessToken, '/auth/login', data)
            return response;
        },
    })

    const signupMutation = useMutation({
        mutationFn: async (data: signUpType) => {
            const response  = await postWithToken(null, '/user/signup', data)
            return response;
        },
    })

    return {
        signIn: signInMutation,
        signUp: signupMutation,
    }
}