cmake_minimum_required(VERSION 3.15)
project(server)

# Устанавливаем стандарт C++
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Определяем Windows API версию только для Windows
if(WIN32)
    add_definitions(-D_WIN32_WINNT=0x0601)
endif()

# Для Linux используем системные библиотеки
if(UNIX AND NOT APPLE)
    find_package(Boost REQUIRED COMPONENTS system filesystem)
    find_package(OpenSSL REQUIRED)
    find_package(Threads REQUIRED)
    
    # Добавляем Crow как header-only библиотеку
    add_library(crow INTERFACE)
    target_include_directories(crow INTERFACE
        ${CMAKE_SOURCE_DIR}/include
        ${CMAKE_SOURCE_DIR}/include/crow/include
        ${Boost_INCLUDE_DIRS}
        ${OPENSSL_INCLUDE_DIR}
    )
    
    target_compile_definitions(crow INTERFACE
        CROW_USE_BOOST
        CROW_USE_IO_CONTEXT
        BOOST_ASIO_NO_DEPRECATED
    )
    
    # Добавление исходных файлов
    set(SOURCES
        src/main.cpp
        src/models/Story.cpp
        src/models/User.cpp
        src/services/StoryService.cpp
        src/services/UserService.cpp
        src/services/CommentService.cpp
        src/services/FavoriteService.cpp
    )
    
    # Создание исполняемого файла
    add_executable(server ${SOURCES})
    
    # Настройка путей включения для сервера
    target_include_directories(server PRIVATE
        ${CMAKE_SOURCE_DIR}/include
        ${CMAKE_SOURCE_DIR}/include/crow/include
        ${Boost_INCLUDE_DIRS}
        ${OPENSSL_INCLUDE_DIR}
    )
    
    # Линковка с библиотеками
    target_link_libraries(server
        PRIVATE
        crow
        ${Boost_LIBRARIES}
        OpenSSL::SSL
        OpenSSL::Crypto
        Threads::Threads
    )
    
    target_compile_definitions(server PRIVATE 
        CROW_USE_BOOST
        CROW_USE_IO_CONTEXT
        BOOST_ASIO_NO_DEPRECATED
    )
    
elseif(WIN32)
    # Настройка vcpkg для Windows
    if(DEFINED ENV{VCPKG_ROOT} AND NOT DEFINED CMAKE_TOOLCHAIN_FILE)
        set(CMAKE_TOOLCHAIN_FILE "$ENV{VCPKG_ROOT}/scripts/buildsystems/vcpkg.cmake"
            CACHE STRING "")
    endif()
    
    # Пути к Boost через vcpkg (только если указаны)
    if(EXISTS "C:/Users/DAB/Desktop/vcpkg/installed/x64-windows")
        set(Boost_ROOT "C:/Users/DAB/Desktop/vcpkg/installed/x64-windows")
        set(Boost_INCLUDEDIR "${Boost_ROOT}/include")
        set(Boost_LIBRARYDIR "${Boost_ROOT}/lib")
        set(Boost_USE_STATIC_LIBS ON)
        set(Boost_USE_MULTITHREADED ON)
        set(Boost_USE_STATIC_RUNTIME OFF)
        set(Boost_NO_SYSTEM_PATHS ON)
        set(Boost_DEBUG ON)
        
        # Пути к OpenSSL
        set(OPENSSL_ROOT_DIR "C:/Users/DAB/Desktop/vcpkg/installed/x64-windows")
        set(OPENSSL_INCLUDE_DIR "C:/Users/DAB/Desktop/vcpkg/installed/x64-windows/include")
        set(OPENSSL_CRYPTO_LIBRARY "C:/Users/DAB/Desktop/vcpkg/installed/x64-windows/lib/libcrypto.lib")
        set(OPENSSL_SSL_LIBRARY "C:/Users/DAB/Desktop/vcpkg/installed/x64-windows/lib/libssl.lib")
        
        # Пути к ZLIB
        set(ZLIB_ROOT "C:/Users/DAB/Desktop/vcpkg/installed/x64-windows")
        set(ZLIB_INCLUDE_DIR "C:/Users/DAB/Desktop/vcpkg/installed/x64-windows/include")
        set(ZLIB_LIBRARY "C:/Users/DAB/Desktop/vcpkg/installed/x64-windows/lib/zlib.lib")
        
        # Пути к BZip2
        set(BZIP2_ROOT "C:/Users/DAB/Desktop/vcpkg/installed/x64-windows")
        set(BZIP2_INCLUDE_DIR "C:/Users/DAB/Desktop/vcpkg/installed/x64-windows/include")
        set(BZIP2_LIBRARY "C:/Users/DAB/Desktop/vcpkg/installed/x64-windows/lib/libbz2.lib")
    endif()
    
    # Поиск необходимых пакетов
    find_package(Boost 1.88.0 REQUIRED COMPONENTS system filesystem)
    find_package(OpenSSL REQUIRED)
    find_package(ZLIB REQUIRED)
    find_package(BZip2 REQUIRED)
    
    # Добавляем Crow как header-only библиотеку
    add_library(crow INTERFACE)
    target_include_directories(crow INTERFACE
        ${CMAKE_SOURCE_DIR}/include
        ${CMAKE_SOURCE_DIR}/include/crow/include
        ${Boost_INCLUDE_DIRS}
        ${OPENSSL_INCLUDE_DIR}
        ${ZLIB_INCLUDE_DIRS}
        ${BZIP2_INCLUDE_DIR}
    )
    target_compile_definitions(crow INTERFACE
        CROW_USE_BOOST
        CROW_USE_IO_CONTEXT
        BOOST_ASIO_NO_DEPRECATED
        BOOST_VERSION=108800
        ASIO_VERSION=101008
        _WIN32_WINNT=0x0601
        _CRT_SECURE_NO_WARNINGS
        _SCL_SECURE_NO_WARNINGS
    )
    
    # Добавление исходных файлов
    set(SOURCES
        src/main.cpp
        src/models/Story.cpp
        src/models/User.cpp
        src/services/StoryService.cpp
        src/services/UserService.cpp
        src/services/CommentService.cpp
        src/services/FavoriteService.cpp
    )
    
    # Создание исполняемого файла
    add_executable(server ${SOURCES})
    
    # Настройка путей включения для сервера
    target_include_directories(server PRIVATE
        ${CMAKE_SOURCE_DIR}/include
        ${CMAKE_SOURCE_DIR}/include/crow/include
        ${Boost_INCLUDE_DIRS}
        ${OPENSSL_INCLUDE_DIR}
        ${ZLIB_INCLUDE_DIRS}
        ${BZIP2_INCLUDE_DIR}
    )
    
    # Линковка с библиотеками
    target_link_libraries(server
        PRIVATE
        crow
        ${Boost_LIBRARIES}
        OpenSSL::SSL
        OpenSSL::Crypto
        ZLIB::ZLIB
        ${BZIP2_LIBRARY}
    )
    
    # Добавление определений для Windows
    target_compile_definitions(server PRIVATE 
        _WIN32_WINNT=0x0601
        _CRT_SECURE_NO_WARNINGS
        _SCL_SECURE_NO_WARNINGS
        CROW_USE_BOOST
        CROW_USE_IO_CONTEXT
        BOOST_ASIO_NO_DEPRECATED
        BOOST_VERSION=108800
        ASIO_VERSION=101008
    )
    
    # Отключаем предупреждения о преобразовании типов
    if(MSVC)
        target_compile_options(server PRIVATE /wd4244 /wd4267 /wd4456 /wd4458)
    endif()
endif()
