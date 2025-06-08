const templates = {}

const renderTemplate = async (template, specs) => {
    var templateText = "";

    if(Object.hasOwn(templates, template))
    {
        templateText = templates[template]
    }
    else
    {
        const response = await fetch(`js/templates/${template}`)
        templateText = await response.text()
        templates[template] = templateText
    }

    const rendered = ejs.render(templateText, specs)
    return rendered

}