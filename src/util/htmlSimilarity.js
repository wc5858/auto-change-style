

function similarity(dom1, dom2, k = 0.5) {
    return k * structuralSimilarity(dom1, dom2) + (1 - k) * styleSimilarity(dom1, dom2)
}

function istructuralSimilarity(dom1, dom2) {
//     def get_tags(doc):
//     tags = list()

//     for el in doc.getroot().iter():
//         if isinstance(el, lxml.html.HtmlElement):
//             tags.append(el.tag)
//         elif isinstance(el, lxml.html.HtmlComment):
//             tags.append('comment')
//         else:
//             raise ValueError('Don\'t know what to do with element: {}'.format(el))

//     return tags


// def structural_similarity(document_1, document_2):
//     try:
//         document_1 = lxml.html.parse(StringIO(document_1))
//         document_2 = lxml.html.parse(StringIO(document_2))
//     except Exception as e:
//         print(e)
//         return 0

//     tags1 = get_tags(document_1)
//     tags2 = get_tags(document_2)
//     diff = difflib.SequenceMatcher()
//     diff.set_seq1(tags1)
//     diff.set_seq2(tags2)

//     return diff.ratio()
}

function styleSimilarity(dom1, dom2) {
//     def get_classes(html):
//     doc = Selector(text=html)
//     classes = set(doc.xpath('//*[@class]/@class').extract())
//     result = set()
//     for cls in classes:
//         for _cls in cls.split():
//             result.add(_cls)
//     return result


// def jaccard_similarity(set1, set2):
//     set1 = set(set1)
//     set2 = set(set2)
//     intersection = len(set1 & set2)
//     denominator = len(set1) + len(set2) - intersection
//     return intersection / max(denominator, 0.000001)


// def style_similarity(page1, page2):
//     """

//     A = classes(Document_1)
//     B = classes(Document_2)

//     style_similarity = |A & B| / (|A| + |B| - |A & B|)

//     :param page1: html of the page1
//     :param page2: html of the page2
//     :return: Number between 0 and 1. If the number is next to 1 the page are really similar.
//     """
//     classes_page1 = get_classes(page1)
//     classes_page2 = get_classes(page2)
//     return jaccard_similarity(classes_page1, classes_page2)
}