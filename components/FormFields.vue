<template>
  <form
    @submit.prevent="submitForm"
    method="post"
    novalidate="true"
    class="columns is-mobile is-multiline">
    <component :is='wrapperComponent' v-for="(field, key) of fields" :key="key" :label="field.label" :type="field.type" :message="field.message" :custom-class="requiredField(field.required)" :class="field.component.class">
      <component
        :is="field.component.is"
        v-bind="field.component.attrs"
        v-model="modelObj[valueKey(field)]"
      >
        <template v-if="field.component.is === 'b-select' && field.component.options" >
          <option v-for="(option, key) of field.component.options" :key="key">{{option}}</option>
        </template>
        <template v-if="field.component.is === 'b-select' && field.component.remote">
          <option v-for="(option, key) of remotes[field.field]" :key="key" :value="option.id">{{option[field.mainField]}}</option>
        </template>
        <template v-if="field.component.is === 'b-upload'">
          <span class="file-cta">
            <b-icon class="file-icon" icon="upload"></b-icon>
            <span class="file-label">Click to upload</span>
          </span>
        </template>
      </component>
      <template v-if="field.component.is === 'b-upload'">
        <div class="tags">
          <span class="tag is-primary" v-if="!field.component.attrs.multiple && modelObj[field.field]">
            {{ modelObj[field.field].name }}
            <button class="delete is-small" type="button" @click.prevent="nullField(field.field)"></button>
          </span>
          <span v-else v-for="(file, index) in modelObj[field.field]"
              :key="index"
              class="tag is-primary" >
              {{file.name}}
              <button class="delete is-small"
                  type="button"
                  @click.prevent.stop="deleteDropFile(field.field, index)">
              </button>
          </span>
        </div>
      </template>
    </component>
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
    },
    wrapperComponent: {
      type: String,
      default: 'div'
    }
  },
  data () {
    return {
      modelObj: this.model,
      errors: [],
      filesToDelete: [],
      fileDeleteError: false
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
    valueKey(field) {
      switch(field.type) {
        case 'time':
          return `${field.field}_skrapi_time`
        default:
          return field.field
      }
    },
    nullField(field) {
      this.filesToDelete.push(this.modelObj[field])
      this.modelObj[field] = null
      this.modelObj[`files.${field}`] = null
    },
    deleteDropFile(field, index) {
      this.filesToDelete.push(this.modelObj[field][index])
      this.modelObj[field].splice(index, 1)
    },
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
        const d = this.modelObj[`${a.field}_skrapi_time`]
        if (d) {
          const time = d.toISOString().split('T').shift()
          const formatTimeStr = a => String(a).padStart(2, '0')
          const timeStr = `${formatTimeStr(d.getHours())}:${formatTimeStr(d.getMinutes())}:${formatTimeStr(d.getSeconds())}`
          this.modelObj[a.field] = timeStr
        }
      })
    },
    async deleteFiles() {
      for(const id of this.filesToDelete) {
        try {
          await this.$axios.delete(`/files/uploads/${id}`)
        } catch (e) {
          this.fileDeleteError = true
        }
      }
      this.filesToDelete = []
    },
    submitForm: async function (e) {
      this.parseTimeFields()
      this.requiredFields()

      if (this.errors.length > 0) {
        return
      }

      const formData = this.fields.filter(a => a.type === 'media')
        .reduce((acc, mediaField) => {
            [].concat(this.modelObj[mediaField.field]).forEach((file, index) => {
              if (file instanceof File){
                acc.append(`files.${mediaField.field}`, file, file.name)
              }
            })
            return acc
        },
        new FormData);

        const finalData = Object.assign({}, this.modelObj)
        this.fields.filter(a => a.type === 'media' && a.component.attrs.multiple).forEach(media => {
          const files = []
          for(const file of finalData[media.field]) {
            if (!(file instanceof File)) {
              files.push(file)
            }
          }
          finalData[media.field] = files
        })

      formData.append('data', JSON.stringify(finalData))

      try {
        const resp = await this.$axios[this.axiosMethod](this.finalRoute, formData)
        const join = this.redirect.includes('?') ? '&' : '?'
        await this.filesToDelete
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
          if (this.fileDeleteError) {
            this.$buefy.toast.open({
              duration: 5000,
              message: 'One or more files could not be deleted',
              position: 'is-top',
              type: 'is-danger',
              queue: false
            })
            this.fileDeleteError = false
          }
        }
      } catch (err) {
        try {
        const { data: { message, data: { errors } } } = err
        // errors.field lookup attributes
        const messages = Object.keys(errors)
          .reduce((acc, key) => {
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
  fetch() {
    this.fields.filter(a => a.default)
      .forEach(a => {
        if (!this.modelObj[this.valueKey(a)]){
          this.modelObj[this.valueKey(a)] = a.default
        }
      })
  }
}
</script>
