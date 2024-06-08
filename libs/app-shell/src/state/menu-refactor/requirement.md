Stage 1
- create state that will contain track what are the list of items to be shown, as per current user, in menu-state
- create state that will track sidebarState in uiFeature:
    - menu position
    - menu visible
    - menu expanded
    - toggle visibility
    - toggle position
- create state that will track horizontal menu visbility
- effects:
    - when breakpoint changes or authentication changes
      - then
        - as per screen size, hide/show menu, contract/expand menu, show/hide toggle
        - change toggle position
      - else
        - hide menu and contract menu
        - change toggle position
          
