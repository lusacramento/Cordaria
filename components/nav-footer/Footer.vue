<template>
  <div>
    <footer class="footer container-fluid d-flex">
      <div class="row align-items-center d-flex justify-content-center">
        <div class="col-sm-3 credits">
          <div id="credits" class="">
            <p class="d-block">
              Developer:
              <a :href="team.author.link" rel="nofollow" target="_blank">{{ team.author.name }}</a>

              <br />
              Designer: &nbsp;
              <a :href="team.design.link" rel="nofollow" target="_blank">{{ team.design.name }}</a>
            </p>
          </div>
        </div>
        <div class="col-sm-3">
          <div class="copyright text-center">
            <p>
              Todos os Direitos Reservados
              <br />
              Versão {{ version }}
            </p>
          </div>
        </div>
        <div class="col-sm-6">
          <div class="financied">
            <img
              id="publics-logo"
              :src="logoAldirBlanc.link"
              :alt="logoAldirBlanc.altText"
              class="figure figure-img img-fluid"
            />
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import publicLogos from "@/assets/imgs/public-agencies-horizontal-logo.png";
export default {
  data() {
    return {
      logoAldirBlanc: {
        link: publicLogos,
        altText: "logos orgãos culturais públicos",
      },

      team: {
        author: {
          name: "Lu Sacramento",
          link: "https://lusacramento.com.br",
        },
        design: {
          name: "Gabriel Barreto",
          link: "https://mixeldesign.com.br/",
        },
      },
      isDisabledfoot: false,
      version: "estável 1.1.3 - 2022",
    };
  },
};
</script>

<style>
.footer {
  border-top: 2px solid rgba(255, 255, 255, 0.3);
}

.credits,
.copyright {
  font-family: "Encode Sans";
  font-weight: var(--font-light);
}

.credits {
  font-size: 0.8em;
}

.copyright {
  font-size: 0.7em;
}

.disable-footer {
  display: none;
}

@media (min-width: 991.96px) {
  .footer {
    width: 80% !important;
  }
}

@media (max-width: 991.98px) {
  .credits {
    text-align: center !important;
  }
}
</style>
