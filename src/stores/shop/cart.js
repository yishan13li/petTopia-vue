import { defineStore } from "pinia";
import axios from "axios";

const PATH = `${import.meta.env.VITE_API_URL}`;

export const useCartStore = defineStore('cart', {
    state: () => ({
        cartCount: 0
    }),
    actions: {
        //FIXME: memberId帶入
        async fetchCartCount() {
            await axios({
                method: 'get',
                url: `${PATH}/shop/cart/api/getMemberCartCount`,
                params: { memberId: 11 }
            })
                .then(response => {
                    this.cartCount = response.data;
                    console.log(response.data);
                })
                .catch(error => console.log(error));
        }


    },
    persist: {
        strategies: [
            {
                key: 'cart-store', // 存儲 key
                storage: sessionStorage
            }
        ]
    }
});