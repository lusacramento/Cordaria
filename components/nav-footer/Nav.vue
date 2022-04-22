<template>
  <nav id="nav-bar" class="nav navbar navbar-expand-lg align-content-center">
    <div class="container-fluid">
      <nuxt-link
        id="link-principal"
        to="/"
        class="navbar-brand logo-cordaria"
        :class="{ active: isActiveTheProject }"
        aria-current="page"
      >
        <img
          :src="icons.cordaria.url"
          :alt="icons.cordaria.altText"
          class="img img-fluid"
          @mouseover="icons.cordaria.url = imageMouseOver(icons.cordaria)"
          @mouseleave="icons.cordaria.url = imageMouseLeave(icons.cordaria)"
        />
      </nuxt-link>
      <button
        class="navbar-dark navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
        @click="showMenu()"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div
        id="navbarSupportedContent"
        class="navbar-collapse"
        :class="{ collapse: isCollapse }"
      >
        <div class="container-fluid justify-content-end">
          <ul class="navbar-nav" :class="{ collapseColor: !isCollapse }">
            <li class="nav-item">
              <nuxt-link
                to="https://cordaria.com.br/o-tutorial"
                class="nav-link the-tutorial-link"
                :class="{ theTutorialLinkActive: isActiveTheTutorial }"
                ><span>Tutorial</span></nuxt-link
              >
            </li>
            <li class="nav-item">
              <nuxt-link
                to="https://cordaria.com.br/dicas"
                class="nav-link clues-link"
                :class="{ cluesLinkActive: isActiveClues }"
                ><span>Dicas</span></nuxt-link
              >
            </li>
            <li class="nav-item">
              <nuxt-link
                to="https://cordaria.com.br"
                class="nav-link the-project-link"
                :class="{
                  theProjectLinkActive: isActiveTheProject,
                }"
                aria-current="page"
                ><span>Sobre</span></nuxt-link
              >
            </li>
            <li class="nav-item">
              <a class="nav-link email-link" :href="icons.email.href">
                <img
                  class="img img-fluid"
                  :src="icons.email.url"
                  :alt="icons.email.altText"
                  @mouseover="icons.email.url = imageMouseOver(icons.email)"
                  @mouseleave="icons.email.url = imageMouseLeave(icons.email)"
                />
              </a>
            </li>
            <li class="nav-item">
              <a
                class="nav-link insta-link"
                href="https://instagram.com/cordaria.app"
                target="_blank"
              >
                <img
                  class="img img-fluid"
                  :src="icons.insta.url"
                  :alt="icons.insta.altText"
                  @mouseover="icons.insta.url = imageMouseOver(icons.insta)"
                  @mouseleave="icons.insta.url = imageMouseLeave(icons.insta)"
                />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import cordariaIconDisabled from '@/assets/imgs/logo-cordaria-disabled.png'
import cordariaIconEnabled from '@/assets/imgs/logo-cordaria-enabled.png'

import emailIconDisabled from '@/assets/imgs/email-icon-disabled.png'
import emailIconEnabled from '@/assets/imgs/email-icon-enabled.png'

import instaIconDisabled from '@/assets/imgs/logo-insta-disabled.png'
import instaIconEnabled from '@/assets/imgs/logo-insta-enabled.png'
export default {
  name: 'NavBar',
  // eslint-disable-next-line require-await
  props: {
    baseUrl: {
      type: String,
      default() {
        return ''
      },
    },
  },
  data() {
    return {
      icons: {
        cordaria: {
          url: cordariaIconDisabled,
          altText: 'Logotipo do Cordaria',
          enabled: cordariaIconEnabled,
          disabled: cordariaIconDisabled,
        },

        email: {
          href: 'mailto:japraticouhoje@cordaria.com.br',
          url: emailIconDisabled,
          altText: 'Ícone contato',
          enabled: emailIconEnabled,
          disabled: emailIconDisabled,
        },

        insta: {
          url: instaIconDisabled,
          altText: 'Ícone Instagram',
          enabled: instaIconEnabled,
          disabled: instaIconDisabled,
        },
      },
      currentUrl: this.baseUrl,
      isActiveTheProject: false,
      isActiveTheResearch: false,
      isActiveThePratice: false,
      isActiveTheTutorial: false,
      isActiveClues: false,
      isOverIconMenu: false,
      isOverIcontEmail: false,
      isOverIconInstagram: false,
      isCollapse: true,
    }
  },
  watch: {
    $route() {
      this.iniciateActive()
    },
  },
  // eslint-disable-next-line require-await
  async mounted() {
    this.currentUrl = await this.getUrl()
    this.iniciateActive()
  },

  methods: {
    getUrl: function async() {
      return window.location.href
    },
    imageMouseOver(img) {
      return img.enabled
    },
    imageMouseLeave(img) {
      return img.disabled
    },

    showMenu() {
      this.isCollapse = !this.isCollapse
    },

    removeAllActive() {
      this.isActiveTheProject = false
      this.isActiveTheResearch = false
      this.isActiveThePratice = false
      this.isActiveTheTutorial = false
      this.isActiveClues = false
      this.isOverIconMenu = false
    },

    iniciateActive() {
      this.removeAllActive()
      // console.log("base url:", this.baseUrl);
      switch (window.location.href) {
        case `${this.baseUrl}`:
          this.isActiveTheProject = true
          break
        case `${this.baseUrl}a-pesquisa`:
          this.isActiveTheResearch = true
          break
        case `${this.baseUrl}a-pratica`:
          this.isActiveThePratice = true
          break
        case `${this.baseUrl}o-tutorial`:
          this.isActiveTheTutorial = true
          break
        case `${this.baseUrl}dicas`:
          this.isActiveClues = true
          break
        default:
          break
      }
    },
  },
}
</script>

<style>
.nav {
  font-size: var(--font-size-nav);
  font-family: var(--font-semibold);
  margin-left: 5px;
  margin-right: 5px;
}

.collapseColor {
  background-color: var(--bg-nav-collapse) !important;
  display: block;
  padding: 10px;
  width: 200px !important;
  border-radius: 15pt;
  color: rgba(255, 255, 255, 1) !important;
}

.nav-link {
  color: var(--font-color-nav) !important;
  margin: 0 10px;
}

.theProjectLinkActive {
  color: var(--the-project-color) !important;
}
.the-project-link:hover {
  color: var(--the-project-color) !important;
}

.theResearchLinkActive {
  color: var(--the-research-color) !important;
}
.the-research-link:hover {
  color: var(--the-research-color) !important;
}

.thePraticeLinkActive {
  color: var(--the-pratice-color) !important;
}
.the-pratice-link:hover {
  color: var(--the-pratice-color) !important;
}

.theTutorialLinkActive {
  color: var(--the-tutorial-color) !important;
}
.the-tutorial-link:hover {
  color: var(--the-tutorial-color) !important;
}

.cluesLinkActive {
  color: var(--clues-color) !important;
}
.clues-link:hover {
  color: var(--clues-color) !important;
}

button:hover {
  background-color: rgba(255, 255, 255, 0.089);
}

@media (min-width: 991.98px) {
  .logo-cordaria {
    margin-left: 115px;
  }
}

@media (max-width: 576px) {
  .logo-cordaria {
    margin-left: 28px;
  }
}
</style>
