export const rgthreeConfig = {
  "features": {
    "menu_auto_nest": {
      "subdirs": null,
      "threshold": 20
    },
    "menu_queue_selected_nodes": true,
    "monitor_for_corrupt_links": false,
    "patch_recursive_execution": true,
    "progress_bar": {
      "enabled": true,
      "height": 16,
      "position": "top"
    },
    "show_alerts_for_corrupt_workflows": false
  },
  "log_level": "WARN",
  "nodes": {
    "reroute": {
      "default_height": 30,
      "default_layout": [
        "Left",
        "Right"
      ],
      "default_resizable": false,
      "default_width": 40,
      "fast_reroute": {
        "enabled": true,
        "key_connections_input": "Shift + S",
        "key_connections_output": "Shift + D",
        "key_create_while_dragging_link": "Shift + R",
        "key_move": "Shift + Z",
        "key_resize": "Shift + X",
        "key_rotate": "Shift + A"
      }
    }
  }
}