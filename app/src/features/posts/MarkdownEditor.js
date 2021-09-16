import React, { Fragment } from "react";
import MDEditor from "@uiw/react-md-editor";

const MarkdownEditor = React.forwardRef((props, ref) => {
  return (({ mdStr, ...props }) => {
    const state = {
      visibleDragbar: true,
      hideToolbar: true,
      highlightEnable: true,
      enableScroll: true,
      value: mdStr || "",
      preview: "live",
    };

    return (
      <Fragment>
        <MDEditor
          autoFocus
          previewOptions={{
            linkTarget: "_blank",
          }}
          height={400}
          highlightEnable={state.highlightEnable}
          hideToolbar={!state.hideToolbar}
          enableScroll={state.enableScroll}
          visibleDragbar={state.visibleDragbar}
          textareaProps={{
            placeholder: "Please enter Markdown text",
          }}
          preview={state.preview}
          {...props}
        />
      </Fragment>
    );
  })({
    ...props,
    ref,
  });
});

export default MarkdownEditor;
