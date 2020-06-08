var swatch_list = {};

(async function () {
    let response = await fetch("/api/listRecipies");
    let message = await response.json();

    async function getUserInfo() {
        const response = await fetch("/.auth/me");
        const payload = await response.json();
        const { clientPrincipal } = payload;
        return clientPrincipal;
    }
    // console.log(await getUserInfo());
    swatch_list = message.recipies;
    console.log(JSON.stringify(swatch_list, '', ' '));

    Vue.component('recipie-swatch', {
        props: ['swatch', 'in_gramm'],
        template: '<div class="card" style="width: 18rem; margin: 5px">' +
            '<div src="..." class="card-img-top" v-bind:style="{backgroundColor: swatch.rgb_value}"  alt="..."><div style="height: 75px">&nbsp;</div></div>' +
            ' <div class="card-body">' +
            '  <h5 class="card-title">{{ swatch.name }}</h5>' +
            '  <p class="card-text" style="font-size: 0.7em"><table style="width:100%;"><tr><td style="width: 25%; text-align: center; background-color:rgb(0,255,255)">{{ swatch.cyan_pct }}%</td>' +
            '<td style="width: 25%; text-align: center; background-color:rgb(255,0,255)">{{ swatch.magenta_pct }}%</td>' +
            '<td style="width: 25%; text-align: center; background-color:rgb(255,255,0)">{{ swatch.yellow_pct }}%</td>' +
            '<td style="width: 25%; text-align: center; background-color:rgb(0,0,0); color: #fff">{{ swatch.black_pct }}%</td></tr></table></p>' +

            '  <p class="card-text" style="font-size: 0.7em"><table style="width:100%;"><tr><td style="width: 25%; text-align: center; background-color:rgb(0,255,255)">{{ in_gramm (swatch.cyan_pct,10) }}g</td>' +
            '<td style="width: 25%; text-align: center; background-color:rgb(255,0,255)">{{ in_gramm (swatch.magenta_pct,10) }}g</td>' +
            '<td style="width: 25%; text-align: center; background-color:rgb(255,255,0)">{{ in_gramm (swatch.yellow_pct,10) }}g</td>' +
            '<td style="width: 25%; text-align: center; background-color:rgb(0,0,0); color: #fff">{{ in_gramm (swatch.black_pct,10) }}g</td></tr>' +
            '<tr><td style="width: 25%; text-align: center; background-color:white">{{ in_gramm (100-swatch.cyan_pct,10) }}g</td>' +
            '<td style="width: 25%; text-align: center; background-color:white">{{ in_gramm (100-swatch.magenta_pct,10) }}g</td>' +
            '<td style="width: 25%; text-align: center; background-color:white">{{ in_gramm (100-swatch.yellow_pct,10) }}g</td>' +
            '<td style="width: 25%; text-align: center; background-color:white; ">{{ in_gramm (100-swatch.black_pct,10) }}g</td></tr></table></p>' +

            ' </div>' +
            '</div>'
    })

    for (i = 0; i < swatch_list.length; i++) {

        c_val = swatch_list[i].cyan_pct / 100;
        m_val = swatch_list[i].magenta_pct / 100;
        y_val = swatch_list[i].yellow_pct / 100;
        k_val = swatch_list[i].black_pct / 100;

        r_val = 255 * (1 - c_val) * (1 - k_val)
        g_val = 255 * (1 - m_val) * (1 - k_val)
        b_val = 255 * (1 - y_val) * (1 - k_val)

        swatch_list[i].rgb_value = '#' + ('0' + Math.trunc(r_val).toString(16)).substr(-2) +
            ('0' + Math.trunc(g_val).toString(16)).substr(-2) +
            ('0' + Math.trunc(b_val).toString(16)).substr(-2);

        console.log(swatch_list[i])
    }

    var bdy = new Vue({
        el: '#app',
        data: {
            recipies: swatch_list,
            homepage_title: 'My Paint Mixer'
        },
        methods: {
            in_gramm: function (in_pct, in_total) {
                return ((in_total / 4) * (in_pct / 100)).toFixed(2);
            }
        }
    })

})();