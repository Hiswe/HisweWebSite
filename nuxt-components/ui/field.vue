<style lang="scss" scoped>
.field {
  border: 0;
  padding: 0;

  @media #{$mq-medium} {
    display: flex;
    flex-direction: column;
  }

  &__error-message {
    font-style: italic;
    padding-left: 0.5em;
    font-size: 0.9em;
    color: red;
    display: inline-block;
  }
}
label {
  @media #{$mq-medium} {
    flex: 0 0 var(--grid-size);
    height: var(--grid-size);
    padding-top: 0.5rem;
  }
}
label,
input,
textarea {
  display: block;
  color: white;
}
input,
textarea {
  background: none;
  border: 4px solid var(--c-primary-darker);
  display: block;
  width: 100%;
  flex-grow: 1;
  padding: 0 0.5em;
  transition: border 0.25s, background 0.25s;

  .field--invalid & {
    border-color: red;
  }

  &:focus {
    background: var(--c-primary-darkest-highlight);
    border-color: var(--c-primary);
  }
}
input {
  padding: 0 0.5em;
}
textarea {
  padding: 0.5em;
  min-height: 8em;
  resize: vertical;
}
.error-fade {
  &-enter-active,
  &-leave-active {
    transition: opacity 0.75s, transform 0.5s;
  }
  &-enter,
  &-leave-to {
    opacity: 0;
    transform: translateX(15px);
  }
}
</style>

<script>
import isEmail from 'validator/lib/isEmail'
import isEmpty from 'validator/lib/isEmpty'

export default {
  name: `hiswe-field`,
  props: {
    tag: {
      type: String,
      default: `input`,
    },
    name: {
      type: String,
      required: true,
    },
    valid: {
      type: Boolean,
      default: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      pristine: true,
    }
  },
  watch: {
    disabled(newVal, oldVal) {
      // disabled mean it has been submited
      // • reset pristine state for validation showing
      if (newVal === true) this.pristine = true
    },
  },
  computed: {
    showError() {
      return !this.valid && this.pristine
    },
  },
  methods: {
    handleBlur(event) {
      // ignore if event is a window blur
      if (document.activeElement === this.controlEl) return
      this.pristine = false
    },
  },
  render(h) {
    return (
      <div
        class={[
          `field`,
          `field--${this.name}`,
          { 'field--invalid': this.showError },
        ]}
      >
        <label for={this.name}>
          {this.name}
          <transition name="error-fade">
            {!this.showError ? null : (
              <span class="field__error-message">{`${
                this.name
              } is invalid`}</span>
            )}
          </transition>
        </label>
        {h(this.tag, {
          attrs: {
            id: this.name,
            name: this.name,
            disabled: this.disabled,
            ...this.$attrs,
          },
          on: {
            // https://vuejs.org/v2/guide/render-function.html#Event-amp-Key-Modifiers
            '&blur': this.handleBlur,
          },
        })}
      </div>
    )
  },
}
</script>