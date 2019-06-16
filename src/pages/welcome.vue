<template>
    <q-page class="flex flex-center">
        <div row>
            <q-btn color="primary" label="登录" @click="login()" ></q-btn>
        </div>
        <div row>
            <q-input v-model="restaurantId" stack-label="餐厅ID"/>
            <q-btn color="primary" label="确认选择" @click="submitRestaurant()" ></q-btn>
            <q-btn color="primary" label="查看餐厅" @click="chooseRestaurant()" ></q-btn>
        </div>
    </q-page>
</template>

<script>
export default {
    data(){
        return {
            restaurantId: 0,
        }
    },
    mounted(){
        if(this.$auth.check()){
            this.login()
        }else{
            this.axios.get('/restaurant/guid')
                .then(response=>{
                    console.log(response)
                })
                .catch(error=>{
                    console.log(error)
                })
        }
    },
    methods: {
        login(){
            this.$auth.oauth2({
                provider: 'keycloak',
                params:{},
            })
        },
        chooseRestaurant(){
            console.log(this.$store.state.restaurant.id)
        },
        submitRestaurant(){
            this.$store.commit('restaurant/setId', this.restaurantId)
            this.$router.push('/')
        }
    },
}
</script>

