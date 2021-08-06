const BaseAdapter = require("ghost-storage-base")
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs').promises
const fetch = require('node-fetch')
const debug = require('ghost-ignition').debug('adapter')

class SupabaseStorageAdapter extends BaseAdapter {
    constructor(options = {}) {
        super()

        this.bucketName = options.bucket || 'ghost-bucket'
        this.client = createClient(options.supabaseUrl, options.supabaseKey)
    }

    async save(file, targetDir) {
        const dir = targetDir || this.getTargetDir()
        const fileName = await this.getUniqueFileName(file, dir)
        const data = await fs.readFile(file.path)

        debug(`save:`, `${JSON.stringify(file)} | ${fileName}`)

        return Promise.all([
            this.client
                .storage
                .from(this.bucketName)
                .upload(fileName, data, {
                    cacheControl: 3600,
                    upsert: false,
                    contentType: file.contentType
                })
        ])
            .then(([_, error]) => {
                if (error) {
                    throw error
                }

                const { data } = this.client
                    .storage
                    .from(this.bucketName)
                    .getPublicUrl(fileName)

                return data.publicURL
            })
    }

    exists(filename, targetDir) {
        const dir = targetDir || this.getTargetDir()
        const filepath = `${dir}/${filename}`

        debug(`exists:`, `${filepath}`)

        const { data, error } = this.client
            .storage
            .from(this.bucketName)
            .getPublicUrl(filepath)

        return fetch(data.publicURL).then(res => {
            return res.status === 200
        });
    }

    serve() {
        // No need to serve because absolute URLs are returned
        return (req, res, next) => {
            next();
        }
    }

    delete(fileName, targetDir) {
        const dir = targetDir || this.getTargetDir()
        const filepath = `${dir}/${fileName}`

        debug(`delete:`, `${filepath}`)

        return this.client
            .storage
            .from(this.bucketName)
            .remove([filepath])
    }

    read(options) {
        debug(`read:`, `${JSON.stringify(options)}`)

        return this.client
            .storage
            .from(this.bucketName)
            .download(options.path)
    }
}

module.exports = SupabaseStorageAdapter