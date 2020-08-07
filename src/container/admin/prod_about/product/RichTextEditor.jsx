import React, { Component } from 'react'
import { EditorState, convertToRaw, ContentState } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
export default class RichTextEditor extends Component {
  state = {
    editorState: EditorState.createEmpty(),
  }
  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    })
  }
  getRichText = () =>
    draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
  setRichText = (detail) => {
    const result = htmlToDraft(detail)
    if (result) {
      const contentState = ContentState.createFromBlockArray(
        result.contentBlocks
      )
      const editorState = EditorState.createWithContent(contentState)
      this.setState({ editorState })
    }
  }
  render() {
    const { editorState } = this.state
    return (
      <div>
        <Editor
          editorState={editorState}
          editorStyle={{
            minHeight: '200px',
            border: '1px solid #6c6c6c',
            paddingLeft: '10px',
          }}
          onEditorStateChange={this.onEditorStateChange}
        />
      </div>
    )
  }
}
