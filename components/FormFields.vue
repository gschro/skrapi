<template>
  <form
    @submit.prevent="submitForm"
    method="post"
    novalidate="true"
    class="columns is-mobile is-multiline">
    <b-field v-for="(field, key) of fields" :key="key" :label="field.label" :type="field.type" :message="field.message" :custom-class="requiredField(field.required)" class='column mb-3 is-one-third-widescreen is-12-mobile small-gap no-marginb'>
      <component
        :is="field.component"
        v-bind="field.attrs"
        v-model="modelObj[field.type === 'time' ? new Symbol(field.field) : field.field]"
      >
        <template v-if="field.component === 'b-select' && field.options" >
          <option v-for="(option, key) of field.options" :key="key">{{option}}</option>
        </template>
        <template v-if="field.component === 'b-select' && field.remote">
          <option v-for="(option, key) of remotes[field.field]" :key="key" :value="option.id">{{option[field.mainField]}}</option>
        </template>
      </component>
    </b-field>
    <slot></slot>
    <div class="column is-12">
      <b-button tag="input"
        type="is-primary"
        native-type="submit"
        :value="buttonLabel" />
    </div>
  </form>
</template>


<style>
.control .select, .control .select select {
  width: 100%;
}
.no-marginb {
  margin-bottom: 0;
}
div.field:not(:last-child) {
  margin-bottom: 0 !important;
}
.required:after {
    content:"*";
    color: red;
  }
</style>

<script>
import FetchPending from '~/components/FetchPending'

export default {
  name: 'FormFields',
  components: {
    FetchPending
  },
  props: {
    name: {
      type: String
    },
    fields: {
      type: Array,
      required: true
    },
    model: {
      type: Object,
      required: true
    },
    remotes: {
      type: Object
    },
    plural: {
      type: String
    },
    redirect: {
      type: String
    },
    method: {
      type: String
    },
    modelName: {
      type: String
    },
    stayOnPage: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      modelObj: this.model,
      errors: []
    }
  },
  computed: {
    finalMethod () {
      return this.method === 'put' ? 'Update' : 'Add'
    },
    buttonLabel () {
      return `${this.finalMethod} ${this.name}`
    },
    messageLabel () {
      const ending = this.finalMethod.endsWith('e') ? 'd' : 'ed'
      return `${this.name} ${this.finalMethod}${ending}!`
    },
    axiosMethod () {
      return `$${this.method}`
    },
    finalRoute () {
      const id = this.method === 'put' ? `/${this.modelObj.id}` : ''
      const route = this.modelName || this.plural.toLowerCase()
      return `/${route}${id}`
    }
  },
  methods: {
    requiredField: (required) => {
      return required ? 'required' : ''
    },
    requiredFields: function () {
      this.errors = []
      this.fields.filter(a => a.required).map(a => {
        const field = a.field
        const index = this.fields.findIndex(a => a.field === field)
        if (!this.modelObj[field]) {
          this.fields[index].componentState = 'is-danger'
          const error = `${a.label} is required`
          this.fields[index].message = error
          this.errors.push(error)
        } else {
          this.fields[index].componentState = ''
          this.fields[index].message = ''
        }
      })
    },
    parseTimeFields() {
      const timeFields = this.fields.filter(a => a.type === 'time').forEach(a => {
      const d = this.modelObj[new Symbol(a.field)]
      const time = d.toISOString().split('T').shift();
      const formatTimeStr = a => String(a).padStart(2, '0')
      const timeStr = `${formatTimeStr(d.getHours())}:${formatTimeStr(d.getMinutes())}:${formatTimeStr(d.getSeconds())}`
      this.modelObj[a.field] = timeStr
      })
    },
    submitForm: async function (e) {
      this.parseTimeFields()
      this.requiredFields()
      if (this.errors.length > 0) {
        return
      }

      try {
        const resp = await this.$axios[this.axiosMethod](this.finalRoute, this.modelObj)
        const join = this.redirect.includes('?') ? '&' : '?'
        if (!this.stayOnPage){
          this.$router.push(`${this.redirect}${join}message=${this.messageLabel}`)
        } else {
          this.$buefy.toast.open({
            duration: 5000,
            message: this.messageLabel,
            position: 'is-top',
            type: 'is-success',
            queue: false
          })
        }
      } catch (err) {
        try {
        const { data: { message, data: { errors } } } = err
        // errrors.field lookup attributes
        const messages = Object.keys(errors).reduce((acc, key) => {
          const [field] = this.fields.filter(a => a.field === key)
          const error = errors[key].map(e => e.replace(key, field.label))
          return [...acc, ...error]
        }, [])
        const errorType = message.replace('Error', '')
        console.log('messages', messages)
        const output = messages.join(', ')
        console.log('output')
        this.$buefy.toast.open({
          duration: 5000,
          message: `${errorType} Error${messages.length > 1 ? 's' : ''}: ${output}`,
          position: 'is-bottom',
          type: 'is-danger',
          queue: false
        })
        } catch (e) {
          this.$buefy.toast.open({
          duration: 5000,
          message: `Error: ${err.statusText}`,
          position: 'is-bottom',
          type: 'is-top',
          queue: false
        })
        }
      }
    }
  },
}
</script>
