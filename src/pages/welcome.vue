<template>
    <q-page class="flex flex-center">
        <p class="q-pt-sm">请，首先选择一个餐厅进行操作！</p>
        <div class="q-pa-sm">            
            <q-card class="q-ma-md" inline v-for="(item, idx) in restaurants" v-bind:key="idx">
                <!-- <q-card-media>
                    <img src="~assets/donuts.png">
                </q-card-media> -->
                <q-card-title>
                    {{ item.name }}
                    <q-rating slot="subtitle" v-model="stars" :max="5" />
                    <div slot="right" class="row items-center">
                    <q-icon name="place" /> 250 ft
                    </div>
                </q-card-title>
                <q-card-main>
                    <p>好吃就常来呀~</p>
                    <p class="text-faded">{{ item.address }}</p>
                </q-card-main>
                <q-card-separator />
                <q-card-actions>
                    <q-btn flat round dense icon="event" />
                    <q-btn flat label="9:30-14:00" />
                    <q-btn flat label="16:30-21:30" />
                    <q-btn color="primary" label="进入餐厅" @click="chooseRestaurant(item)" />
                </q-card-actions>
            </q-card>
        </div>
    </q-page>
</template>

<script>
export default {
    data(){
        return {
            restaurants:[],
            stars: 5
        }
    },
    created(){
        this.axios.get("/restaurant")
            .then(response=>{
                console.log(response.data)
                this.restaurants = response.data.content
            })
    },
    methods: {
        chooseRestaurant(item){
            this.$store.commit('restaurant/setRestaurant', item)
            this.$router.push('/')
        },
    },
}
</script>

