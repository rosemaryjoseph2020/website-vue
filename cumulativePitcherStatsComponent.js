const Vue = require("vue");
const axios = require("axios");
const date = require("../../modules/todayDate");

const { EventBus } = require("../../modules/event-bus");

const pitcherCumulativeStats = {
  cumlativeStats: Vue.component("pitcher-season-stats", {
    props: ["props_player_id"],
    data: function() {
      return {
        Wins: "",
        Losses: "",
        IP: "",
        SO: "",
        ERA: "",
        showComponent: false,
        loading: false
      };
    },
    mounted: function() {
      EventBus.$on(
        "showPitcherTemplateClicked",
        this.onShowPitcherTemplateClicked
      );
    },
    methods: {
      onShowPitcherTemplateClicked: function(playerId) {
        if (playerId === this.props_player_id) {
          this.loading = true;
          this.showComponent = !this.showComponent;
          this.retrievePitcherStats(playerId);
        }
      },
      retrievePitcherStats: function(playerId) {
        let seasonName = `${date.year}-regular`;
        const url = `https://api.mysportsfeeds.com/v1.2/pull/mlb/${seasonName}/cumulative_player_stats.json?player=`;
        const params = {
          playerstats: "W,L,SO,IP,ERA",
          force: true
        };

        axios({
          method: "get",
          headers: {
            Authorization:
              "Basic NzAxMzNkMmEtNzVmMi00MjdiLWI5ZDYtOTgyZTFhOnNwb3J0c2ZlZWRzMjAxOA=="
          },
          url: url + playerId,
          params: params
        }).then(response => {
          this.Wins =
            response.data.cumulativeplayerstats.playerstatsentry[0].stats.Wins[
              "#text"
            ];
          this.Losses =
            response.data.cumulativeplayerstats.playerstatsentry[0].stats.Losses[
              "#text"
            ];
          this.IP =
            response.data.cumulativeplayerstats.playerstatsentry[0].stats.InningsPitched[
              "#text"
            ];
          this.ERA =
            response.data.cumulativeplayerstats.playerstatsentry[0].stats.EarnedRunAvg[
              "#text"
            ];
          this.SO =
            response.data.cumulativeplayerstats.playerstatsentry[0].stats.PitcherStrikeouts[
              "#text"
            ];

          this.loading = false;
        });
      }
    },
    template: `
        <div>
          <transition name="fade">
            <tr class="d-flex header-row" v-if="showComponent">
                <th class="col-2 justify-content-center season-stats-headers"  scope="col" @click="retrievePitcherStats(props_player_id)">
                Season</th>
                <th class="col-2 justify-content-center season-stats-headers" scope="col">Wins</th>
                <th class="col-2 justify-content-center season-stats-headers" scope="col">Losses</th>
                <th class="col-2 justify-content-center season-stats-headers" scope="col">SO</th>
                <th class="col-2 justify-content-center season-stats-headers" scope="col">IP</th>
                <th class="col-2 justify-content-right season-stats-headers" scope="col">ERA</th>
            </tr>
          </transition>

          <transition name="fade">
            <tr class="d-flex flex-wrap season-stats" v-if="showComponent">
                <span class="cumlativeStatsLoading" v-if="loading">
                Loading
                <!-- below is our font awesome icon with the class “spin-it” where 
                    we have set the infinite animation:                        -->
                  <i class="fas fa-cog spin-it fa-sm" aria-hidden="true"></i>
                </span>
                <td class="col-2 justify-content-center" justify-content="center"></td>
                <td class="col-2 justify-content-center" justify-content="center">
                {{ Wins }}</td>
                <td class="col-2 justify-content-center">{{ Losses }}</td>
                <td class="col-2 justify-content-center"> {{ SO }}</td>
                <td class="col-2 justify-content-center"> {{ IP }}</td>
                <td class="col-2 justify-content-center">{{ ERA }}</td>
            </tr>
          </transition>
        </div>
    ` // End template
  })
};

module.exports = { pitcherCumulativeStats };
